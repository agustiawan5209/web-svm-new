import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface MetricItemProps {
  label: string;
  value: string | number;
  description?: string;
  quality?: "good" | "average" | "poor";
}

const MetricItem = ({
  label,
  value,
  description,
  quality = "average",
}: MetricItemProps) => {
  const qualityColors = {
    good: "bg-green-100 text-green-800 border-green-200",
    average: "bg-yellow-100 text-yellow-800 border-yellow-200",
    poor: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Badge variant="outline" className={qualityColors[quality]}>
          {quality}
        </Badge>
      </div>
      <p className="text-xl md:text-2xl font-bold">{value}</p>
    </div>
  );
};

interface CoefficientItemProps {
  variable: string;
  coefficient: number;
  significance: "high" | "medium" | "low";
}

const CoefficientItem = ({
  variable,
  coefficient,
  significance,
}: CoefficientItemProps) => {
  const significanceColors = {
    high: "text-blue-600",
    medium: "text-blue-400",
    low: "text-blue-300",
  };

  return (
    <div className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
      <span className="text-sm">{variable}</span>
      <span className={`font-medium ${significanceColors[significance]}`}>
        {coefficient > 0 ? "+" : ""}
        {coefficient.toFixed(4)}
      </span>
    </div>
  );
};

interface MetricsPanelProps {
  rSquared?: number;
  adjustedRSquared?: number;
  predictionAccuracy?: number;
  coefficients?: Array<{
    variable: string;
    coefficient: number;
    significance: "high" | "medium" | "low";
  }>;
}

const MetricsPanel = ({
  rSquared = 0.876,
  adjustedRSquared = 0.864,
  predictionAccuracy = 92.3,
  coefficients = [
    {
      variable: "Water Temperature",
      coefficient: 0.7823,
      significance: "high",
    },
    { variable: "Salinity", coefficient: -0.4231, significance: "high" },
    { variable: "Sunlight Hours", coefficient: 0.5612, significance: "medium" },
    { variable: "pH Level", coefficient: 0.2134, significance: "low" },
    {
      variable: "Nutrient Density",
      coefficient: 0.6521,
      significance: "medium",
    },
  ],
}: MetricsPanelProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <Card className="border-0 shadow-none gap-2 py-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Regression Metrics</CardTitle>
          <CardDescription>
            Key performance indicators for the prediction model
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <MetricItem
              label="R-squared"
              value={rSquared.toFixed(3)}
              description="Coefficient of determination - how well the model fits the data"
              quality={
                rSquared > 0.8 ? "good" : rSquared > 0.6 ? "average" : "poor"
              }
            />
            <MetricItem
              label="Adjusted R-squared"
              value={adjustedRSquared.toFixed(3)}
              description="R-squared adjusted for the number of predictors"
              quality={
                adjustedRSquared > 0.8
                  ? "good"
                  : adjustedRSquared > 0.6
                    ? "average"
                    : "poor"
              }
            />
            <MetricItem
              label="Prediction Accuracy"
              value={`${predictionAccuracy.toFixed(1)}%`}
              description="Percentage of accurate predictions within acceptable range"
              quality={
                predictionAccuracy > 90
                  ? "good"
                  : predictionAccuracy > 75
                    ? "average"
                    : "poor"
              }
            />
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Regression Coefficients
            </h3>
            <div className="space-y-2">
              {coefficients.map((coef, index) => (
                <CoefficientItem
                  key={index}
                  variable={coef.variable}
                  coefficient={coef.coefficient}
                  significance={coef.significance}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsPanel;
