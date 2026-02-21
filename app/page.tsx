import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PieChart } from "lucide-react";
import { FeatureCard } from "@/components/landing/feature-card";


import { BarChart3, TrendingUp, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-screen flex-col justify-center z-0 bg-linear-to-b from-white to-indigo-50/30 overflow-hidden">
      <Image
        src    = "/omaha_logo.svg"
        alt    = "Brand representation"
        width  = {600}
        height = {600}
        priority
        className="absolute opacity-[0.02] pointer-events-none left-1/2 -z-10 -translate-x-1/2 translate-y-1/2 animate-rotate"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl rounded-3xl bg-linear-to-br from-primary/5 to-primary/10 p-12 shadow-indigo-200/50 shadow-2xl">
        <div className="mx-auto w-full max-w-7xl rounded-3xl bg-linear-to-br from-primary/5 to-primary/10 p-12 shadow-indigo-200/50 shadow-2xl">
          {/* Hero Section */}
          <header className="mx-auto w-full px-4 py-8 text-center">
            <h1 className="text-5xl m-4 font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              <span className="text-primary">Ziggy</span> <span>Portfolio Insights</span>
            </h1>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <PieChart className="h-4 w-4" />
              Portfolio Management
            </div>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Visualize and analyze the top tech companies&apos; key financial metrics.
            </p>
          </header>
          <Separator className="bg-primary-foreground"/>

          {/* Features Section */}
          <section className="mx-auto w-full px-4">
            <div className="flex w-full flex-col items-center justify-center gap-8 py-6 md:flex-row md:justify-around">
                <div className="w-full md:w-auto">
                  <div className="w-full max-w-md">
                    <h2 className="mb-6 text-center text-2xl font-bold text-foreground sm:text-3xl">
                      Smart Portfolio Visualizations
                    </h2>
                    <p className="mb-8 text-center text-base text-muted-foreground sm:text-lg">
                      Access 6 different metric views and analyze real-time data across top tech companies.
                    </p>
                  </div>
                </div>
                <div className="mb-0 flex justify-center h-fit md:mb-12">
                  <Link 
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 sm:px-8 sm:py-4 sm:text-lg"
                  >
                    Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
            </div>

            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
              {LANDING_FEATURES.map((feature, idx) => (
                <FeatureCard 
                  key={`hero-feature_${idx}`}
                  name={feature.name}
                  icon={feature.icon}
                  description={feature.description}
                />
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-8 w-full border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Ziggy Portfolio Manager. Omaha Insights Use Case</p>
          </footer>
        </div>
      </div>
    </div>
  );
}