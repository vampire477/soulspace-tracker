import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BookOpen, ClipboardCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ moods: 0, journals: 0, assessments: 0, avgMood: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const [moodRes, journalRes, assessRes] = await Promise.all([
        supabase.from("mood_entries").select("mood_level").eq("user_id", user.id),
        supabase.from("journal_entries").select("id").eq("user_id", user.id),
        supabase.from("assessment_results").select("id").eq("user_id", user.id),
      ]);
      const moods = moodRes.data || [];
      const avgMood = moods.length ? Math.round((moods.reduce((a, m) => a + m.mood_level, 0) / moods.length) * 10) / 10 : 0;
      setStats({
        moods: moods.length,
        journals: journalRes.data?.length || 0,
        assessments: assessRes.data?.length || 0,
        avgMood,
      });
    };
    fetchStats();
  }, [user]);

  const cards = [
    { title: "Mood Entries", value: stats.moods, icon: Brain, to: "/mood", color: "text-primary" },
    { title: "Avg Mood", value: stats.avgMood || "—", icon: TrendingUp, to: "/mood", color: "text-accent" },
    { title: "Journal Entries", value: stats.journals, icon: BookOpen, to: "/journal", color: "text-chart-3" },
    { title: "Assessments", value: stats.assessments, icon: ClipboardCheck, to: "/assessment", color: "text-chart-4" },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-serif text-3xl text-foreground">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">Here's a snapshot of your wellness journey</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <Link key={card.title} to={card.to}>
            <Card className="shadow-card transition-all hover:-translate-y-1 hover:shadow-soft" style={{ animationDelay: `${i * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{card.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/mood" className="flex items-center gap-3 rounded-lg bg-secondary p-3 transition-colors hover:bg-secondary/80">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Log your mood</span>
            </Link>
            <Link to="/journal" className="flex items-center gap-3 rounded-lg bg-secondary p-3 transition-colors hover:bg-secondary/80">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Write in journal</span>
            </Link>
            <Link to="/assessment" className="flex items-center gap-3 rounded-lg bg-secondary p-3 transition-colors hover:bg-secondary/80">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Take PHQ-9 assessment</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Daily Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-secondary p-6 text-center">
              <p className="font-serif text-lg text-foreground">"Taking care of your mental health is a sign of strength."</p>
              <p className="mt-3 text-sm text-muted-foreground">Remember to be kind to yourself today.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
