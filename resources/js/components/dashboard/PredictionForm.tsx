import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertCircle } from "lucide-react";

interface PredictionFormProps {
  onSubmit?: (data: PredictionFormData) => void;
  isLoading?: boolean;
}

export interface PredictionFormData {
  waterTemperature: number;
  salinity: number;
  pHLevel: number;
  dissolvedOxygen: number;
  lightExposure: number;
  plantingDensity: number;
}

const PredictionForm: React.FC<PredictionFormProps> = ({
  onSubmit = () => {},
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<PredictionFormData>({
    waterTemperature: 25,
    salinity: 35,
    pHLevel: 7.5,
    dissolvedOxygen: 6,
    lightExposure: 70,
    plantingDensity: 50,
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: keyof PredictionFormData, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.waterTemperature < 10 || formData.waterTemperature > 40) {
      setError("Water temperature should be between 10°C and 40°C");
      return;
    }

    if (formData.salinity < 20 || formData.salinity > 50) {
      setError("Salinity should be between 20 ppt and 50 ppt");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-bold">
          Generate Harvest Prediction
        </CardTitle>
        <CardDescription>
          Enter environmental variables to predict harvest yield
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="waterTemperature">Water Temperature (°C)</Label>
              <span className="text-sm font-medium">
                {formData.waterTemperature}°C
              </span>
            </div>
            <Slider
              id="waterTemperature"
              min={10}
              max={40}
              step={0.1}
              value={[formData.waterTemperature]}
              onValueChange={(value) =>
                handleInputChange("waterTemperature", value[0])
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="salinity">Salinity (ppt)</Label>
              <span className="text-sm font-medium">
                {formData.salinity} ppt
              </span>
            </div>
            <Slider
              id="salinity"
              min={20}
              max={50}
              step={0.5}
              value={[formData.salinity]}
              onValueChange={(value) => handleInputChange("salinity", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="pHLevel">pH Level</Label>
              <span className="text-sm font-medium">{formData.pHLevel}</span>
            </div>
            <Slider
              id="pHLevel"
              min={6}
              max={9}
              step={0.1}
              value={[formData.pHLevel]}
              onValueChange={(value) => handleInputChange("pHLevel", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="dissolvedOxygen">Dissolved Oxygen (mg/L)</Label>
              <span className="text-sm font-medium">
                {formData.dissolvedOxygen} mg/L
              </span>
            </div>
            <Slider
              id="dissolvedOxygen"
              min={2}
              max={10}
              step={0.1}
              value={[formData.dissolvedOxygen]}
              onValueChange={(value) =>
                handleInputChange("dissolvedOxygen", value[0])
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="lightExposure">Light Exposure (%)</Label>
              <span className="text-sm font-medium">
                {formData.lightExposure}%
              </span>
            </div>
            <Slider
              id="lightExposure"
              min={10}
              max={100}
              step={1}
              value={[formData.lightExposure]}
              onValueChange={(value) =>
                handleInputChange("lightExposure", value[0])
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="plantingDensity">
                Planting Density (plants/m²)
              </Label>
              <span className="text-sm font-medium">
                {formData.plantingDensity} plants/m²
              </span>
            </div>
            <Slider
              id="plantingDensity"
              min={10}
              max={100}
              step={1}
              value={[formData.plantingDensity]}
              onValueChange={(value) =>
                handleInputChange("plantingDensity", value[0])
              }
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Calculating..." : "Generate Prediction"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <div className="flex items-center text-xs text-muted-foreground">
          <InfoIcon className="h-3 w-3 mr-1" />
          <span>
            Predictions are based on multiple linear regression models
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PredictionForm;
