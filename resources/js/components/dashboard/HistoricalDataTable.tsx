import React, { useState } from "react";
import { Download, Filter, SortAsc, SortDesc } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";

interface HarvestData {
  id: number;
  date: string;
  location: string;
  waterTemperature: number;
  salinity: number;
  predictedYield: number;
  actualYield: number;
  harvestCondition: "optimal" | "suboptimal" | "poor";
}

const HistoricalDataTable = ({ data = mockData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof HarvestData>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 5;

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  // Sort data based on sort field and direction
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle sort
  const handleSort = (field: keyof HarvestData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle export
  const handleExport = (format: "csv" | "excel" | "pdf") => {
    // In a real implementation, this would generate and download the file
    console.log(`Exporting data as ${format}`);
    alert(`Exporting data as ${format} (mock implementation)`);
  };

  // Get condition badge color
  const getConditionBadge = (condition: HarvestData["harvestCondition"]) => {
    switch (condition) {
      case "optimal":
        return <Badge className="bg-green-500">Optimal</Badge>;
      case "suboptimal":
        return <Badge className="bg-yellow-500">Suboptimal</Badge>;
      case "poor":
        return <Badge className="bg-red-500">Poor</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Calculate accuracy percentage
  const calculateAccuracy = (predicted: number, actual: number) => {
    const accuracy = 100 - Math.abs(((predicted - actual) / actual) * 100);
    return Math.max(0, Math.min(100, accuracy)).toFixed(1) + "%";
  };

  return (
    <Card className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-lg md:text-xl font-bold">
          Historical Harvest Data
        </h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-48 md:w-64"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date
                {sortField === "date" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <SortAsc className="inline h-4 w-4" />
                    ) : (
                      <SortDesc className="inline h-4 w-4" />
                    )}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("location")}
              >
                Location
                {sortField === "location" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <SortAsc className="inline h-4 w-4" />
                    ) : (
                      <SortDesc className="inline h-4 w-4" />
                    )}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("waterTemperature")}
              >
                Water Temp (°C)
                {sortField === "waterTemperature" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <SortAsc className="inline h-4 w-4" />
                    ) : (
                      <SortDesc className="inline h-4 w-4" />
                    )}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("salinity")}
              >
                Salinity (ppt)
                {sortField === "salinity" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <SortAsc className="inline h-4 w-4" />
                    ) : (
                      <SortDesc className="inline h-4 w-4" />
                    )}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("predictedYield")}
              >
                Predicted Yield (kg)
                {sortField === "predictedYield" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <SortAsc className="inline h-4 w-4" />
                    ) : (
                      <SortDesc className="inline h-4 w-4" />
                    )}
                  </span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("actualYield")}
              >
                Actual Yield (kg)
                {sortField === "actualYield" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <SortAsc className="inline h-4 w-4" />
                    ) : (
                      <SortDesc className="inline h-4 w-4" />
                    )}
                  </span>
                )}
              </TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("harvestCondition")}
              >
                Condition
                {sortField === "harvestCondition" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <SortAsc className="inline h-4 w-4" />
                    ) : (
                      <SortDesc className="inline h-4 w-4" />
                    )}
                  </span>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.waterTemperature.toFixed(1)}</TableCell>
                  <TableCell>{item.salinity.toFixed(1)}</TableCell>
                  <TableCell>{item.predictedYield.toFixed(2)}</TableCell>
                  <TableCell>{item.actualYield.toFixed(2)}</TableCell>
                  <TableCell>
                    {calculateAccuracy(item.predictedYield, item.actualYield)}
                  </TableCell>
                  <TableCell>
                    {getConditionBadge(item.harvestCondition)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-xs md:text-sm text-gray-500 order-2 sm:order-1">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length}{" "}
          entries
        </div>
        <Pagination className="order-1 sm:order-2">
          <PaginationContent className="flex-wrap justify-center">
            <PaginationItem>
              <PaginationPrevious
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} size={undefined}              />
            </PaginationItem>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)} size={undefined}                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : ""} size={undefined}              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
};

// Mock data for demonstration
const mockData: HarvestData[] = [
  {
    id: 1,
    date: "2023-05-15",
    location: "North Bay",
    waterTemperature: 24.5,
    salinity: 32.1,
    predictedYield: 450.25,
    actualYield: 442.8,
    harvestCondition: "optimal",
  },
  {
    id: 2,
    date: "2023-05-22",
    location: "East Coast",
    waterTemperature: 23.8,
    salinity: 31.5,
    predictedYield: 425.1,
    actualYield: 398.75,
    harvestCondition: "suboptimal",
  },
  {
    id: 3,
    date: "2023-05-29",
    location: "South Reef",
    waterTemperature: 25.2,
    salinity: 33.0,
    predictedYield: 475.5,
    actualYield: 482.3,
    harvestCondition: "optimal",
  },
  {
    id: 4,
    date: "2023-06-05",
    location: "West Inlet",
    waterTemperature: 22.1,
    salinity: 30.2,
    predictedYield: 380.75,
    actualYield: 325.4,
    harvestCondition: "poor",
  },
  {
    id: 5,
    date: "2023-06-12",
    location: "Central Bay",
    waterTemperature: 24.0,
    salinity: 32.5,
    predictedYield: 445.0,
    actualYield: 451.2,
    harvestCondition: "optimal",
  },
  {
    id: 6,
    date: "2023-06-19",
    location: "North Bay",
    waterTemperature: 24.8,
    salinity: 32.3,
    predictedYield: 455.3,
    actualYield: 460.1,
    harvestCondition: "optimal",
  },
  {
    id: 7,
    date: "2023-06-26",
    location: "East Coast",
    waterTemperature: 23.5,
    salinity: 31.0,
    predictedYield: 415.8,
    actualYield: 390.25,
    harvestCondition: "suboptimal",
  },
  {
    id: 8,
    date: "2023-07-03",
    location: "South Reef",
    waterTemperature: 25.5,
    salinity: 33.2,
    predictedYield: 480.0,
    actualYield: 485.5,
    harvestCondition: "optimal",
  },
  {
    id: 9,
    date: "2023-07-10",
    location: "West Inlet",
    waterTemperature: 21.8,
    salinity: 29.8,
    predictedYield: 370.25,
    actualYield: 310.8,
    harvestCondition: "poor",
  },
  {
    id: 10,
    date: "2023-07-17",
    location: "Central Bay",
    waterTemperature: 24.2,
    salinity: 32.7,
    predictedYield: 448.5,
    actualYield: 455.3,
    harvestCondition: "optimal",
  },
];

export default HistoricalDataTable;
