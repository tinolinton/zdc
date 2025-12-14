import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

type QuestionSeed = {
  text: string;
  answers: { text: string; isCorrect: boolean }[];
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionsPath = path.join(__dirname, "questions.json");
const questions: QuestionSeed[] = JSON.parse(
  fs.readFileSync(questionsPath, "utf-8"),
);

async function main() {
  const email = "dev@chimaliro.com";
  const username = "linton";
  const password = await bcrypt.hash("password123", 10); // Default password, should be changed

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name: "Linton",
        password,
        role: Role.SUPERADMIN,
        isVerified: true,
      },
    });
    console.log("Superadmin created");

    // Seed achievements
    const achievement = await prisma.achievement.create({
      data: {
        title: "First Pass",
        description: "Pass any test with at least 22/25.",
        icon: "Award",
      },
    });

    await prisma.userAchievement.create({
      data: {
        userId: user.id,
        achievementId: achievement.id,
      },
    });

    // Seed notifications
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Welcome to ZimDrive Coach",
        body: "Start a timed test to simulate the real exam. Good luck!",
      },
    });

    // Seed resources
    await prisma.resource.createMany({
      data: [
        {
          title: "Zimbabwe Road Signs",
          description: "Key signage and meanings for the provisional test.",
          url: "https://zimraresigns.example.com",
        },
        {
          title: "Intersection Diagrams",
          description: "Right-of-way rules with visuals.",
          url: "https://zimdrive.example.com/diagrams",
        },
      ],
    });
  } else {
    console.log("Superadmin already exists");
  }

  console.log("Refreshing questions and answers...");
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();

  const questionRecords = questions.map((question, index) => ({
    id: randomUUID(),
    text: question.text,
    imageUrl: null,
    category: null,
    orderIndex: index + 1,
  }));

  const answerRecords = questionRecords.flatMap((question, index) =>
    questions[index].answers.map((answer) => ({
      id: randomUUID(),
      questionId: question.id,
      text: answer.text,
      isCorrect: answer.isCorrect,
    })),
  );

  await prisma.question.createMany({ data: questionRecords });
  await prisma.answer.createMany({ data: answerRecords });

  console.log(
    `Seeded ${questions.length} questions and ${answerRecords.length} answers from ${questionsPath}`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
