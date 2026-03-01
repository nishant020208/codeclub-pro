import React from "react";
import { Medal } from "lucide-react";

const BadgesPage: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-3xl font-bold text-foreground">Badges</h1>
      <p className="text-muted-foreground mt-1">Earn badges by completing challenges</p>
    </div>
    <div className="glass-card rounded-xl p-12 text-center">
      <Medal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">Badges coming soon! Keep coding to earn them.</p>
    </div>
  </div>
);

export default BadgesPage;
