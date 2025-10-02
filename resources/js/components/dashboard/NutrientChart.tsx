import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

interface NutrientChartProps {
  data?: Array<{
    date: string;
    ph: number;
    ec: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  }>;
}

const defaultData = [
  {
    date: "Mon",
    ph: 6.2,
    ec: 1.8,
    nitrogen: 150,
    phosphorus: 50,
    potassium: 200,
  },
  {
    date: "Tue",
    ph: 6.3,
    ec: 1.9,
    nitrogen: 155,
    phosphorus: 52,
    potassium: 205,
  },
  {
    date: "Wed",
    ph: 6.1,
    ec: 1.7,
    nitrogen: 148,
    phosphorus: 49,
    potassium: 198,
  },
  {
    date: "Thu",
    ph: 6.4,
    ec: 2.0,
    nitrogen: 160,
    phosphorus: 55,
    potassium: 210,
  },
  {
    date: "Fri",
    ph: 6.3,
    ec: 1.9,
    nitrogen: 158,
    phosphorus: 53,
    potassium: 208,
  },
  {
    date: "Sat",
    ph: 6.2,
    ec: 1.8,
    nitrogen: 152,
    phosphorus: 51,
    potassium: 203,
  },
  {
    date: "Sun",
    ph: 6.3,
    ec: 1.9,
    nitrogen: 156,
    phosphorus: 54,
    potassium: 207,
  },
];

const NutrientChart = ({ data = defaultData }: NutrientChartProps) => {
  const [timeRange, setTimeRange] = useState("week");
  const [selectedNutrients, setSelectedNutrients] = useState<string[]>([
    "nitrogen",
    "phosphorus",
    "potassium",
  ]);

  const toggleNutrient = (nutrient: string) => {
    if (selectedNutrients.includes(nutrient)) {
      setSelectedNutrients(selectedNutrients.filter((n) => n !== nutrient));
    } else {
      setSelectedNutrients([...selectedNutrients, nutrient]);
    }
  };

  const nutrientColors = {
    nitrogen: "#3b82f6", // blue
    phosphorus: "#ef4444", // red
    potassium: "#10b981", // green
    ph: "#8b5cf6", // purple
    ec: "#f59e0b", // amber
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-background"
    >
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-medium">Nutrient Trends</CardTitle>
          <div className="flex items-center space-x-2">
            <Tabs
              defaultValue="week"
              onValueChange={setTimeRange}
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select defaultValue="all">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Parameters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(nutrientColors).map(([nutrient, color]) => (
              <Button
                key={nutrient}
                variant={
                  selectedNutrients.includes(nutrient) ? "default" : "outline"
                }
                size="sm"
                onClick={() => toggleNutrient(nutrient)}
                className="flex items-center gap-1"
                style={{
                  backgroundColor: selectedNutrients.includes(nutrient)
                    ? color
                    : "transparent",
                  color: selectedNutrients.includes(nutrient)
                    ? "white"
                    : "inherit",
                  borderColor: color,
                }}
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
              </Button>
            ))}
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                  }}
                  labelStyle={{ color: "#111827" }}
                />
                <Legend />
                {selectedNutrients.includes("nitrogen") && (
                  <Line
                    type="monotone"
                    dataKey="nitrogen"
                    stroke={nutrientColors.nitrogen}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {selectedNutrients.includes("phosphorus") && (
                  <Line
                    type="monotone"
                    dataKey="phosphorus"
                    stroke={nutrientColors.phosphorus}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {selectedNutrients.includes("potassium") && (
                  <Line
                    type="monotone"
                    dataKey="potassium"
                    stroke={nutrientColors.potassium}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {selectedNutrients.includes("ph") && (
                  <Line
                    type="monotone"
                    dataKey="ph"
                    stroke={nutrientColors.ph}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {selectedNutrients.includes("ec") && (
                  <Line
                    type="monotone"
                    dataKey="ec"
                    stroke={nutrientColors.ec}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NutrientChart;
