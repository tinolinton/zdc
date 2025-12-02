import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center gap-3">
        <HelpCircle className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>FAQs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• How are tests graded? 22/25 is a pass, 21/25 or below is a fail.</p>
          <p>• Can I retake tests? Yes, start any test from the Tests page.</p>
          <p>
            • Where do I see results? Visit your Dashboard or Test Results pages.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Contact support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Input id="message" placeholder="How can we help?" />
          </div>
          <Button>Send</Button>
        </CardContent>
      </Card>
    </div>
  );
}
