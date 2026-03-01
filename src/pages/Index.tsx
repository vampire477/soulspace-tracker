import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Brain, BookOpen, Shield } from "lucide-react";

const features = [
  { icon: Brain, title: "Mood Tracking", desc: "Log and visualize your daily emotional state" },
  { icon: BookOpen, title: "Journaling", desc: "Express yourself freely in a private journal" },
  { icon: Shield, title: "Self-Assessment", desc: "PHQ-9 depression screening with instant results" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          <span className="font-serif text-xl text-foreground">MindCare</span>
        </div>
        <Link to="/auth">
          <Button>Get Started</Button>
        </Link>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl animate-fade-in">
          <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Your mental wellness companion
          </div>
          <h1 className="font-serif text-5xl leading-tight text-foreground md:text-6xl">
            Take care of your <span className="text-primary">mind</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
            Track your mood, journal your thoughts, and gain insight into your mental health — all in one safe, private space.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="px-8">Start Your Journey</Button>
            </Link>
            <Link to="/resources">
              <Button size="lg" variant="outline" className="px-8">View Resources</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="animate-fade-in rounded-2xl bg-card p-8 shadow-card text-center"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-hero">
                <f.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="mb-2 font-serif text-xl text-foreground">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>MindCare © {new Date().getFullYear()} — Built with care for your wellbeing</p>
      </footer>
    </div>
  );
};

export default Index;
