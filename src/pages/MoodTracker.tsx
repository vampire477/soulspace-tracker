import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const moodEmojis: Record<number, string> = {
  1: "😢", 2: "😞", 3: "😔", 4: "😐", 5: "🙂",
  6: "😊", 7: "😄", 8: "😁", 9: "🤩", 10: "🥳",
};

interface MoodEntry {
  id: string;
  mood_level: number;
  note: string | null;
  created_at: string;
}

const MoodTracker = () => {
  const { user } = useAuth();
  const [moodLevel, setMoodLevel] = useState(5);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchEntries = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setEntries((data as MoodEntry[]) || []);
  };

  useEffect(() => { fetchEntries(); }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("mood_entries").insert({
      user_id: user.id,
      mood_level: moodLevel,
      note: note.trim() || null,
    });
    setSaving(false);
    if (error) { toast.error("Failed to save mood"); return; }
    toast.success("Mood logged!");
    setNote("");
    setMoodLevel(5);
    fetchEntries();
  };

  const chartData = [...entries]
    .reverse()
    .slice(-14)
    .map((e) => ({
      date: format(new Date(e.created_at), "MMM d"),
      mood: e.mood_level,
    }));

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl text-foreground animate-fade-in">Mood Tracker</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-serif">How are you feeling?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <span className="text-6xl">{moodEmojis[moodLevel]}</span>
              <p className="mt-2 text-2xl font-bold text-foreground">{moodLevel}/10</p>
            </div>
            <Slider
              value={[moodLevel]}
              onValueChange={(v) => setMoodLevel(v[0])}
              min={1}
              max={10}
              step={1}
            />
            <Textarea
              placeholder="How are you feeling today? (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={3}
            />
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Log Mood"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-serif">Mood Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[1, 10]} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-muted-foreground">Log at least 2 moods to see your trend</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-card">
        <CardHeader>
          <CardTitle className="font-serif">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground">No entries yet. Log your first mood above!</p>
          ) : (
            <div className="space-y-3">
              {entries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 rounded-lg bg-secondary p-3">
                  <span className="text-2xl">{moodEmojis[entry.mood_level]}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{entry.mood_level}/10</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(entry.created_at), "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                    {entry.note && <p className="mt-1 text-sm text-muted-foreground">{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;
