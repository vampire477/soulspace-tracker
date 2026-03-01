import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Phone, Heart, Lightbulb } from "lucide-react";

const tips = [
  "Practice deep breathing for 5 minutes each morning",
  "Take short breaks during work to stretch and reset",
  "Maintain a consistent sleep schedule",
  "Stay hydrated and eat nutritious meals",
  "Connect with loved ones regularly",
  "Limit screen time before bed",
  "Practice gratitude — write down 3 things you're thankful for",
  "Move your body — even a 10-minute walk helps",
  "Set boundaries and learn to say no",
  "Seek professional help when you need it — it's a sign of strength",
];

const helplines = [
  { name: "Vandrevala Foundation", number: "1860-2662-345", available: "24/7" },
  { name: "iCall", number: "9152987821", available: "Mon–Sat, 8am–10pm" },
  { name: "NIMHANS", number: "080-46110007", available: "Mon–Sat, 9:30am–4:30pm" },
  { name: "Snehi", number: "044-24640050", available: "24/7" },
  { name: "AASRA", number: "9820466726", available: "24/7" },
];

const Resources = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl text-foreground animate-fade-in">Resources</h1>

      <Card className="mb-6 border-accent/30 bg-accent/5 shadow-card">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p className="text-sm text-foreground">
            <strong>Disclaimer:</strong> This application does not provide medical diagnosis. 
            It is designed for self-awareness and wellness tracking only. 
            Please consult a licensed mental health professional for proper evaluation and treatment.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Lightbulb className="h-5 w-5 text-accent" />
              Mental Health Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Heart className="mt-1 h-3 w-3 shrink-0 text-primary" fill="currentColor" />
                  <span className="text-sm text-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Phone className="h-5 w-5 text-primary" />
              India Helpline Numbers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {helplines.map((h) => (
                <div key={h.name} className="rounded-lg bg-secondary p-3">
                  <p className="font-medium text-foreground">{h.name}</p>
                  <a
                    href={`tel:${h.number.replace(/-/g, "")}`}
                    className="text-primary hover:underline"
                  >
                    {h.number}
                  </a>
                  <p className="text-xs text-muted-foreground">{h.available}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
