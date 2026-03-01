import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure",
  "Trouble concentrating on things",
  "Moving or speaking slowly, or being fidgety/restless",
  "Thoughts that you would be better off dead, or of hurting yourself",
];

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const getCategory = (score: number) => {
  if (score <= 4) return { label: "Minimal", color: "text-primary" };
  if (score <= 9) return { label: "Mild", color: "text-accent" };
  if (score <= 14) return { label: "Moderate", color: "text-chart-2" };
  return { label: "Severe", color: "text-destructive" };
};

interface AssessmentResult {
  id: string;
  total_score: number;
  category: string;
  created_at: string;
}

const Assessment = () => {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1));
  const [result, setResult] = useState<{ score: number; category: string } | null>(null);
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("assessment_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setHistory((data as AssessmentResult[]) || []);
  };

  useEffect(() => { fetchHistory(); }, [user]);

  const handleAnswer = (qi: number, value: number) => {
    const updated = [...answers];
    updated[qi] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answers.some((a) => a === -1)) {
      toast.error("Please answer all questions");
      return;
    }
    if (!user) return;

    const totalScore = answers.reduce((a, b) => a + b, 0);
    const category = getCategory(totalScore).label;

    setSaving(true);
    const { error } = await supabase.from("assessment_results").insert({
      user_id: user.id,
      total_score: totalScore,
      category,
      answers,
    });
    setSaving(false);

    if (error) { toast.error("Failed to save result"); return; }

    setResult({ score: totalScore, category });
    toast.success("Assessment completed!");
    fetchHistory();
  };

  const resetAssessment = () => {
    setAnswers(new Array(9).fill(-1));
    setResult(null);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 font-serif text-3xl text-foreground animate-fade-in">PHQ-9 Assessment</h1>
      <p className="mb-6 text-muted-foreground">
        Over the last 2 weeks, how often have you been bothered by the following?
      </p>

      {result ? (
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="font-serif">Your Result</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <span className="text-5xl font-bold text-foreground">{result.score}</span>
              <span className="text-lg text-muted-foreground">/27</span>
            </div>
            <p className={`text-xl font-semibold ${getCategory(result.score).color}`}>
              {result.category} Depression
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
              This is a screening tool, not a diagnosis. Please consult a licensed mental health professional for proper evaluation.
            </p>
            <Button onClick={resetAssessment} className="mt-6">Take Again</Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 shadow-card">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {PHQ9_QUESTIONS.map((q, qi) => (
                <div key={qi} className="rounded-lg bg-secondary p-4">
                  <p className="mb-3 font-medium text-foreground">
                    {qi + 1}. {q}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(qi, opt.value)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          answers[qi] === opt.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleSubmit} disabled={saving} className="mt-6 w-full">
              {saving ? "Saving..." : "Submit Assessment"}
            </Button>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-serif">Assessment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <div>
                    <span className="font-medium text-foreground">Score: {h.total_score}/27</span>
                    <span className={`ml-2 text-sm ${getCategory(h.total_score).color}`}>({h.category})</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(h.created_at), "MMM d, yyyy")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Assessment;
