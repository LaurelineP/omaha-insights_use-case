import { BarChart3, TrendingUp, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  name: string;
  icon: LucideIcon;
  description: string;
}

export const LANDING_FEATURES: Feature[] = [
  { 
    name: "Risk-Adjusted Growth", 
    icon: TrendingUp, 
    description: "Track RAGR to understand company performance relative to risk exposure. Make informed decisions with data-driven insights." 
  },
  { 
    name: "Economic Profit Tracking", 
    icon: BarChart3, 
    description: "Compare economic profit trends across 20 companies with interactive charts spanning 13 years of historical data." 
  },
  { 
    name: "Risk Contribution Analysis", 
    icon: Target, 
    description: "Evaluate harm contribution ratios to identify portfolio risk factors and optimize your investment strategy." 
  },
];
