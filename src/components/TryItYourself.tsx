import React, { useState } from "react";
import { Play, CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface TryItYourselfProps {
  prompt: string;
  expectedOutput: string;
  starterCode?: string;
  language?: string;
}

const TryItYourself: React.FC<TryItYourselfProps> = ({
  prompt,
  expectedOutput,
  starterCode = "",
  language = "python",
}) => {
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState<"idle" | "pass" | "fail">("idle");
  const [userOutput, setUserOutput] = useState("");

  const handleRun = () => {
    // Simple output-check: we simulate running by comparing a trimmed output
    // In a real scenario this would call an execution API
    // For now, we do a basic check against expected output patterns
    try {
      const trimmed = code.trim();
      // Try to extract a return value or print statement
      const printMatch = trimmed.match(/print\s*\(\s*(.+)\s*\)/);
      const returnMatch = trimmed.match(/return\s+(.+)/);
      const consoleMatch = trimmed.match(/console\.log\s*\(\s*(.+)\s*\)/);
      
      let output = "";
      if (printMatch) {
        output = printMatch[1].replace(/['"]/g, "").trim();
      } else if (consoleMatch) {
        output = consoleMatch[1].replace(/['"]/g, "").trim();
      } else if (returnMatch) {
        output = returnMatch[1].replace(/['"]/g, "").trim();
      } else {
        output = trimmed;
      }
      
      setUserOutput(output);
      const expected = expectedOutput.trim().toLowerCase();
      const actual = output.toLowerCase();
      
      if (actual.includes(expected) || expected.includes(actual)) {
        setResult("pass");
      } else {
        setResult("fail");
      }
    } catch {
      setResult("fail");
      setUserOutput("Error executing code");
    }
  };

  const handleReset = () => {
    setCode(starterCode);
    setResult("idle");
    setUserOutput("");
  };

  return (
    <div className="rounded-lg border border-primary/20 bg-background/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/20">
        <span className="text-xs font-mono font-bold text-primary flex items-center gap-2">
          <Play className="w-3 h-3" /> Try It Yourself
        </span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">{language}</span>
      </div>
      
      <div className="p-4 space-y-3">
        <p className="text-sm text-foreground font-medium">{prompt}</p>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-32 px-3 py-2 rounded-md bg-background border border-border font-mono text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
          placeholder={`Write your ${language} code here...`}
          spellCheck={false}
        />
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-mono font-bold hover:bg-primary/90 transition-colors"
          >
            <Play className="w-3 h-3" /> Run
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs font-mono hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
        
        {result !== "idle" && (
          <div className={`flex items-center gap-2 p-3 rounded-md text-xs font-mono ${
            result === "pass"
              ? "bg-primary/10 border border-primary/30 text-primary"
              : "bg-destructive/10 border border-destructive/30 text-destructive"
          }`}>
            {result === "pass" ? (
              <><CheckCircle className="w-4 h-4" /> Correct! Great job.</>
            ) : (
              <><XCircle className="w-4 h-4" /> Not quite. Expected output: "{expectedOutput}". Got: "{userOutput}"</>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TryItYourself;
