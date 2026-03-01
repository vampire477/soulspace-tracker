import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
}

const Journal = () => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchEntries = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setEntries((data as JournalEntry[]) || []);
  };

  useEffect(() => { fetchEntries(); }, [user]);

  const handleSave = async () => {
    if (!user || !content.trim()) {
      toast.error("Please write something first");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("journal_entries").insert({
      user_id: user.id,
      content: content.trim(),
    });
    setSaving(false);
    if (error) { toast.error("Failed to save entry"); return; }
    toast.success("Journal entry saved!");
    setContent("");
    fetchEntries();
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl text-foreground animate-fade-in">Journal</h1>

      <Card className="mb-6 shadow-card">
        <CardHeader>
          <CardTitle className="font-serif">Write your thoughts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's on your mind today? Let it all out..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={5000}
            rows={6}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{content.length}/5000</span>
            <Button onClick={handleSave} disabled={saving || !content.trim()}>
              {saving ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">Your journal is empty. Start writing above!</p>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="shadow-card">
              <CardContent className="pt-6">
                <p className="mb-3 text-sm text-muted-foreground">
                  {format(new Date(entry.created_at), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </p>
                <p className="whitespace-pre-wrap text-foreground leading-relaxed">{entry.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
