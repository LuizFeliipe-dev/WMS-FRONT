
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DepartureStepCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
}

const DepartureStepCard = ({
  title,
  description,
  icon,
  isActive,
  isCompleted
}: DepartureStepCardProps) => {
  return (
    <Card className={cn(
      "border-2 transition-all",
      isActive && !isCompleted && "border-primary",
      isCompleted && "border-green-500 bg-green-50",
      !isActive && !isCompleted && "border-gray-200"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full flex items-center justify-center",
            isActive && !isCompleted && "bg-primary/10 text-primary",
            isCompleted && "bg-green-100 text-green-600",
            !isActive && !isCompleted && "bg-gray-100 text-gray-500"
          )}>
            {icon}
          </div>
          <div>
            <h3 className={cn(
              "font-medium",
              isActive && !isCompleted && "text-primary",
              isCompleted && "text-green-600"
            )}>
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartureStepCard;
