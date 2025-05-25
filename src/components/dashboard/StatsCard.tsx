import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center py-6">
        <span className="text-3xl font-bold mb-2">{value}</span>
        <span className="text-sm text-muted-foreground">{title}</span>
      </CardContent>
    </Card>
  );
} 