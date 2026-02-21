import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  name: string;
  icon: LucideIcon;
  description: string;
}

export function FeatureCard({ name, icon: Icon, description }: FeatureCardProps) {
  return (
    <Card 
      className="bg-white flex flex-col p-8 shadow-indigo-100 shadow-sm transition-all hover:shadow-indigo-200 hover:shadow-md"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-card-foreground">
          {name}
        </h3>
      </div>
      <p className="text-muted-foreground">
        {description}
      </p>
    </Card>
  );
}
