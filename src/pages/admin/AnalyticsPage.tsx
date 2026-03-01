import React from "react";
import { BarChart3 } from "lucide-react";

const AnalyticsPage: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
      <p className="text-muted-foreground mt-1">Course usage and quiz performance insights</p>
    </div>
    <div className="glass-card rounded-xl p-12 text-center">
      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">Analytics dashboard coming soon with detailed charts and insights.</p>
    </div>
  </div>
);

export default AnalyticsPage;
