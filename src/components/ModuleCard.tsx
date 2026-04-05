import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Code, AlertTriangle, Lightbulb, CheckSquare, FileText } from "lucide-react";
import TryItYourself from "./TryItYourself";

export interface ModuleData {
  title: string;
  concept: string;
  realWorldExample: string;
  codeExample: string;
  codeLanguage?: string;
  commonMistakes?: string[];
  practiceQuestions?: string[];
  tryItPrompt?: string;
  tryItExpectedOutput?: string;
  tryItStarterCode?: string;
  summary?: string[];
}

interface ModuleCardProps {
  module: ModuleData;
  index: number;
  totalModules: number;
}

const sectionColors = [
  { border: "border-primary/30", bg: "bg-primary/5", icon: "text-primary", accent: "bg-primary/10" },
  { border: "border-neon-cyan/30", bg: "bg-neon-cyan/5", icon: "text-neon-cyan", accent: "bg-neon-cyan/10" },
  { border: "border-neon-amber/30", bg: "bg-neon-amber/5", icon: "text-neon-amber", accent: "bg-neon-amber/10" },
  { border: "border-neon-purple/30", bg: "bg-neon-purple/5", icon: "text-neon-purple", accent: "bg-neon-purple/10" },
];

const ModuleCard: React.FC<ModuleCardProps> = ({ module, index, totalModules }) => {
  const [expanded, setExpanded] = useState(index === 0);
  const color = sectionColors[index % sectionColors.length];

  return (
    <div className={`rounded-lg border ${color.border} ${color.bg} overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between px-4 py-3 ${color.accent} text-left`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${color.accent}`}>
            <BookOpen className={`w-4 h-4 ${color.icon}`} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Module {index + 1} of {totalModules}
            </span>
            <h3 className={`text-sm font-bold ${color.icon} truncate`}>{module.title}</h3>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-4 py-4 space-y-5">
          {/* Concept */}
          <section>
            <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-foreground mb-2">
              <BookOpen className="w-3.5 h-3.5 text-primary" /> Concept
            </h4>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{module.concept}</div>
          </section>

          {/* Real-World Example */}
          <section>
            <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-foreground mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-neon-amber" /> Real-World Example
            </h4>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{module.realWorldExample}</div>
          </section>

          {/* Code Example */}
          <section>
            <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-foreground mb-2">
              <Code className="w-3.5 h-3.5 text-neon-cyan" /> Code Example
            </h4>
            <pre className="p-3 rounded-md bg-background border border-border overflow-x-auto">
              <code className="text-xs font-mono text-foreground">{module.codeExample}</code>
            </pre>
          </section>

          {/* Common Mistakes */}
          {module.commonMistakes && module.commonMistakes.length > 0 && (
            <section>
              <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-foreground mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> Common Mistakes
              </h4>
              <ul className="space-y-1">
                {module.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-destructive mt-0.5">•</span> {m}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Practice Questions */}
          {module.practiceQuestions && module.practiceQuestions.length > 0 && (
            <section>
              <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-foreground mb-2">
                <CheckSquare className="w-3.5 h-3.5 text-neon-purple" /> Practice Questions
              </h4>
              <ol className="space-y-1 list-decimal list-inside">
                {module.practiceQuestions.map((q, i) => (
                  <li key={i} className="text-sm text-muted-foreground">{q}</li>
                ))}
              </ol>
            </section>
          )}

          {/* Try It Yourself */}
          {module.tryItPrompt && module.tryItExpectedOutput && (
            <TryItYourself
              prompt={module.tryItPrompt}
              expectedOutput={module.tryItExpectedOutput}
              starterCode={module.tryItStarterCode || ""}
              language={module.codeLanguage || "python"}
            />
          )}

          {/* Summary */}
          {module.summary && module.summary.length > 0 && (
            <section className="p-3 rounded-md bg-muted/30 border border-border">
              <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-foreground mb-2">
                <FileText className="w-3.5 h-3.5 text-primary" /> Key Takeaways
              </h4>
              <ul className="space-y-1">
                {module.summary.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span> {s}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
