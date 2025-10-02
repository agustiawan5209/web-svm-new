import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, ZoomIn, ZoomOut } from "lucide-react";

interface DataPoint {
  date: string;
  predicted: number;
  actual: number;
  difference: number;
}

interface InteractiveChartProps {
  data?: DataPoint[];
  title?: string;
  description?: string;
}

const InteractiveChart = ({
  data = [
    { date: "2023-01-01", predicted: 120, actual: 115, difference: -5 },
    { date: "2023-02-01", predicted: 135, actual: 140, difference: 5 },
    { date: "2023-03-01", predicted: 150, actual: 145, difference: -5 },
    { date: "2023-04-01", predicted: 165, actual: 170, difference: 5 },
    { date: "2023-05-01", predicted: 180, actual: 175, difference: -5 },
    { date: "2023-06-01", predicted: 195, actual: 200, difference: 5 },
  ],
  title = "Seaweed Harvest Prediction",
  description = "Comparison of predicted vs actual harvest yields",
}: InteractiveChartProps) => {
  const [activeTab, setActiveTab] = useState("comparison");
  const [timeRange, setTimeRange] = useState("6m");

  // This would be replaced with actual chart rendering using a library like recharts
  const renderChart = () => {
    return (
      <div className="w-full h-[250px] md:h-[300px] bg-muted/20 rounded-md flex items-center justify-center">
        <div className="text-center w-full">
          <p className="text-muted-foreground text-sm md:text-base">
            Chart visualization would render here
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">
            Using data for {activeTab} view over {getTimeRangeLabel(timeRange)}{" "}
            period
          </p>

          {/* Placeholder for chart - in a real implementation this would be replaced with an actual chart component */}
          <div className="mt-4 w-full px-4 md:px-8">
            <div className="h-[150px] md:h-[200px] w-full relative">
              {/* X-axis */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>

              {/* Y-axis */}
              <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-border"></div>

              {/* Sample data points */}
              {data.map((point, index) => {
                const xPos = `${(index / (data.length - 1)) * 100}%`;
                const predictedYPos = `${100 - (point.predicted / 200) * 100}%`;
                const actualYPos = `${100 - (point.actual / 200) * 100}%`;

                return (
                  <React.Fragment key={point.date}>
                    {/* Predicted point */}
                    <div
                      className="absolute w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1 -translate-y-1"
                      style={{ left: xPos, top: predictedYPos }}
                      title={`Predicted: ${point.predicted} kg`}
                    />

                    {/* Actual point */}
                    <div
                      className="absolute w-2 h-2 bg-green-500 rounded-full transform -translate-x-1 -translate-y-1"
                      style={{ left: xPos, top: actualYPos }}
                      title={`Actual: ${point.actual} kg`}
                    />

                    {/* Connect points with lines */}
                    {index < data.length - 1 && (
                      <>
                        <div
                          className="absolute h-[1px] bg-blue-500"
                          style={{
                            left: xPos,
                            top: predictedYPos,
                            width: `${100 / (data.length - 1)}%`,
                            transform: "translateY(1px)",
                          }}
                        />
                        <div
                          className="absolute h-[1px] bg-green-500"
                          style={{
                            left: xPos,
                            top: actualYPos,
                            width: `${100 / (data.length - 1)}%`,
                            transform: "translateY(1px)",
                          }}
                        />
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-3 md:gap-4 mt-4">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs md:text-sm">Predicted</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs md:text-sm">Actual</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getTimeRangeLabel = (range: string) => {
    const labels: Record<string, string> = {
      "1m": "1 month",
      "3m": "3 months",
      "6m": "6 months",
      "1y": "1 year",
      all: "all time",
    };
    return labels[range] || range;
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px] md:w-[130px]">
              <div className="flex items-center gap-1 md:gap-2">
                <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                <SelectValue placeholder="Select range" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last month</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8"
            >
              <ZoomIn className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8"
            >
              <ZoomOut className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="comparison" className="text-xs md:text-sm">
              Comparison
            </TabsTrigger>
            <TabsTrigger value="predicted" className="text-xs md:text-sm">
              Predicted
            </TabsTrigger>
            <TabsTrigger value="actual" className="text-xs md:text-sm">
              Actual
            </TabsTrigger>
            <TabsTrigger value="difference" className="text-xs md:text-sm">
              Difference
            </TabsTrigger>
          </TabsList>
          <TabsContent value="comparison">{renderChart()}</TabsContent>
          <TabsContent value="predicted">{renderChart()}</TabsContent>
          <TabsContent value="actual">{renderChart()}</TabsContent>
          <TabsContent value="difference">{renderChart()}</TabsContent>
        </Tabs>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 md:h-4 md:w-4" />
            <span>Last updated: Today at 14:30</span>
          </div>
          <Button
            variant="link"
            size="sm"
            className="text-xs md:text-sm p-0 h-auto self-start sm:self-auto"
          >
            View detailed analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveChart;
