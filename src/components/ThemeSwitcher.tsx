import React from "react";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { Monitor, Moon, Terminal } from "lucide-react";

const themes: { id: Theme; label: string; icon: React.ElementType }[] = [
  { id: "hacker", label: "Hacker", icon: Terminal },
  { id: "github-dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Monitor },
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-secondary/50 rounded-md p-0.5">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-all ${
            theme === t.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={t.label}
        >
          <t.icon className="w-3 h-3" />
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
