import React, { useState } from "react";
import { Bell, CheckCircle, AlertTriangle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

type AlertSeverity = "warning" | "critical";

interface AlertItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  severity: AlertSeverity;
  parameter: string;
  value: string;
  threshold: string;
}

interface AlertNotificationsProps {
  alerts?: AlertItem[];
  onAcknowledge?: (id: string) => void;
}

const AlertNotifications = ({
  alerts = [
    {
      id: "1",
      title: "pH Level High",
      description: "The pH level is above the recommended range",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      severity: "warning" as AlertSeverity,
      parameter: "pH",
      value: "7.8",
      threshold: "5.5-6.5",
    },
    {
      id: "2",
      title: "Nutrient Concentration Low",
      description: "Nutrient concentration has dropped below minimum threshold",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      severity: "critical" as AlertSeverity,
      parameter: "EC",
      value: "0.8 mS/cm",
      threshold: "1.2-1.6 mS/cm",
    },
    {
      id: "3",
      title: "Water Temperature High",
      description: "Water temperature is above optimal range",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      severity: "warning" as AlertSeverity,
      parameter: "Temp",
      value: "24°C",
      threshold: "18-22°C",
    },
  ],
  onAcknowledge = () => {},
}: AlertNotificationsProps) => {
  const [activeAlerts, setActiveAlerts] = useState<AlertItem[]>(alerts);

  const handleAcknowledge = (id: string) => {
    setActiveAlerts(activeAlerts.filter((alert) => alert.id !== id));
    onAcknowledge(id);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="w-full max-w-md bg-background border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alert Notifications
          {activeAlerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {activeAlerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mb-2 text-green-500" />
            <p>No active alerts</p>
            <p className="text-sm">
              All systems operating within normal parameters
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[320px] pr-4">
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  variant={
                    alert.severity === "critical" ? "destructive" : "default"
                  }
                  className={`border-l-4 ${alert.severity === "critical" ? "border-l-destructive" : "border-l-orange-500"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <AlertTriangle
                        className={`h-4 w-4 mt-0.5 ${alert.severity === "critical" ? "text-destructive" : "text-orange-500"}`}
                      />
                      <div>
                        <AlertTitle className="text-sm font-semibold">
                          {alert.title}
                        </AlertTitle>
                        <AlertDescription className="text-xs mt-1">
                          {alert.description}
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            <span className="text-muted-foreground">
                              Parameter:
                            </span>
                            <span className="font-medium">
                              {alert.parameter}
                            </span>
                            <span className="text-muted-foreground">
                              Current Value:
                            </span>
                            <span className="font-medium">{alert.value}</span>
                            <span className="text-muted-foreground">
                              Threshold:
                            </span>
                            <span className="font-medium">
                              {alert.threshold}
                            </span>
                            <span className="text-muted-foreground">Time:</span>
                            <span className="font-medium">
                              {formatTime(alert.timestamp)}
                            </span>
                          </div>
                        </AlertDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Acknowledge</span>
                    </Button>
                  </div>
                </Alert>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertNotifications;
