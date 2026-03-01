import React from "react";
import { Trophy } from "lucide-react";

const AchievementsPage: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
      <p className="text-muted-foreground mt-1">Track your coding milestones</p>
    </div>
    <div className="glass-card rounded-xl p-12 text-center">
      <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">Achievements coming soon!</p>
    </div>
  </div>
);

export default AchievementsPage;
