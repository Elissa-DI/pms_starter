import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getOutgoingCarsReport,
  getEnteredCarsReport,
} from "@/services/parking.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO, subDays } from "date-fns";
import { Calendar as CalendarIcon, Download, FileText } from "lucide-react";
import LayoutAdmin from "./LayoutAdmin";

const ParkingReports = () => {
  const [activeTab, setActiveTab] = useState("outgoing");
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | undefined>(
    subDays(today, 7)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(today);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : "";
  const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : "";

  const {
    data: outgoingReport,
    isLoading: isOutgoingLoading,
    refetch: refetchOutgoing,
  } = useQuery({
    queryKey: ["outgoingReport", formattedStartDate, formattedEndDate],
    queryFn: () => getOutgoingCarsReport(formattedStartDate, formattedEndDate),
    enabled:
      !!formattedStartDate && !!formattedEndDate && activeTab === "outgoing",
  });

  const {
    data: enteredReport,
    isLoading: isEnteredLoading,
    refetch: refetchEntered,
  } = useQuery({
    queryKey: ["enteredReport", formattedStartDate, formattedEndDate],
    queryFn: () => getEnteredCarsReport(formattedStartDate, formattedEndDate),
    enabled:
      !!formattedStartDate && !!formattedEndDate && activeTab === "entered",
  });

  const handleGenerateReport = () => {
    if (activeTab === "outgoing") {
      refetchOutgoing();
    } else {
      refetchEntered();
    }
  };

  const downloadCSV = (data: any[], filename: string) => {
    // Create CSV content
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((item) => Object.values(item).join(","));
    const csvContent = [headers, ...rows].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <LayoutAdmin>
      <div className="space-y-6">

        <Tabs
          defaultValue="outgoing"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="outgoing">Outgoing Cars</TabsTrigger>
            <TabsTrigger value="entered">Entered Cars</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div>
              <p className="mb-2 text-sm font-medium">Start Date</p>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[200px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setStartDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">End Date</p>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[200px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setEndDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={handleGenerateReport}>Generate Report</Button>
          </div>

          <TabsContent value="outgoing">
            {isOutgoingLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : outgoingReport ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Total Outgoing Cars</CardTitle>
                      <CardDescription>
                        {startDate && endDate
                          ? `From ${format(startDate, "PPP")} to ${format(
                              endDate,
                              "PPP"
                            )}`
                          : "Select date range"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {outgoingReport.totalOutgoingCars}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Total Amount Charged</CardTitle>
                      <CardDescription>
                        {startDate && endDate
                          ? `From ${format(startDate, "PPP")} to ${format(
                              endDate,
                              "PPP"
                            )}`
                          : "Select date range"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        ${outgoingReport.totalAmountCharged.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    Outgoing Cars Details
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() =>
                      downloadCSV(
                        outgoingReport.details,
                        `outgoing-cars-${formattedStartDate}-to-${formattedEndDate}.csv`
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entry ID</TableHead>
                        <TableHead>Plate Number</TableHead>
                        <TableHead>Parking Code</TableHead>
                        <TableHead>Entry Time</TableHead>
                        <TableHead>Exit Time</TableHead>
                        <TableHead>Amount Charged</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outgoingReport.details.map((car) => (
                        <TableRow key={car.id}>
                          <TableCell className="font-medium">
                            {car.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{car.plateNumber}</TableCell>
                          <TableCell>{car.parkingCode}</TableCell>
                          <TableCell>
                            {format(parseISO(car.entryDateTime), "PPp")}
                          </TableCell>
                          <TableCell>
                            {car.exitDateTime
                              ? format(parseISO(car.exitDateTime), "PPp")
                              : "N/A"}
                          </TableCell>
                          <TableCell>${car.chargedAmount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mt-2 text-lg font-medium">
                  No report data available
                </p>
                <p className="text-sm text-muted-foreground">
                  Select a date range and generate a report to view data
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="entered">
            {isEnteredLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : enteredReport ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Total Entered Cars</CardTitle>
                    <CardDescription>
                      {startDate && endDate
                        ? `From ${format(startDate, "PPP")} to ${format(
                            endDate,
                            "PPP"
                          )}`
                        : "Select date range"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {enteredReport.totalEntries}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    Entered Cars Details
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() =>
                      downloadCSV(
                        enteredReport.entries,
                        `entered-cars-${formattedStartDate}-to-${formattedEndDate}.csv`
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entry ID</TableHead>
                        <TableHead>Plate Number</TableHead>
                        <TableHead>Parking Code</TableHead>
                        <TableHead>Entry Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enteredReport.entries.map((car) => (
                        <TableRow key={car.id}>
                          <TableCell className="font-medium">
                            {car.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{car.plateNumber}</TableCell>
                          <TableCell>{car.parkingCode}</TableCell>
                          <TableCell>
                            {format(parseISO(car.entryDateTime), "PPp")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mt-2 text-lg font-medium">
                  No report data available
                </p>
                <p className="text-sm text-muted-foreground">
                  Select a date range and generate a report to view data
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </LayoutAdmin>
  );
};

export default ParkingReports;
