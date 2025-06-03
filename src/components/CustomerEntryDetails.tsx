/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getEntryTicket,
  registerCarExit,
  getExitBill,
} from "@/services/customer.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Car,
  Clock,
  Calendar,
  CircleDollarSign,
  Printer,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import LayoutCustomer from "./LayoutCustomer";

const CustomerEntryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  // Get entry ticket query
  const ticketQuery = useQuery({
    queryKey: ["entryTicket", id],
    queryFn: () => getEntryTicket(id || ""),
    enabled: !!id,
  });

  // Register car exit mutation
  const exitMutation = useMutation({
    mutationFn: () => getExitBill(id || ""),
    onSuccess: () => {
      toast("Your parking bill has been generated.");
      billQuery.refetch();
    },
    onError: (error: Error) => {
      toast.error("Could not register your exit. Please try again.");
      setIsExitDialogOpen(false);
    },
  });

  // Get exit bill query
  const billQuery = useQuery({
    queryKey: ["exitBill", id],
    queryFn: () => getExitBill(id || ""),
    enabled: false, // Will be enabled manually after exit registration
  });

  // Handle exit registration
  const handleExitConfirm = () => {
    exitMutation.mutate();
    setIsExitDialogOpen(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate elapsed time for active entries
  const calculateElapsedTime = (entryDateString: string) => {
    const entryDate = new Date(entryDateString);
    const now = new Date();
    const diffInMs = now.getTime() - entryDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    const hours = Math.floor(diffInHours);
    const minutes = Math.floor((diffInHours - hours) * 60);

    return `${hours}h ${minutes}m`;
  };

  // Calculate estimated cost for active entries
  const calculateEstimatedCost = (
    entryDateString: string,
    hourlyRate: number
  ) => {
    const entryDate = new Date(entryDateString);
    const now = new Date();
    const diffInMs = now.getTime() - entryDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return (diffInHours * hourlyRate).toFixed(2);
  };

  // Handle print ticket/bill
  const handlePrint = () => {
    window.print();
  };

  // Navigate back to dashboard
  const handleBackToDashboard = () => {
    navigate("/customer/dashboard");
  };

  // Redirect to parking view
  const handleFindParking = () => {
    navigate("/customer/parking");
  };

  return (
    <LayoutCustomer>
      <div className="min-h-screen bg-background">
        <main className="max-w-2xl mx-auto p-6">
          {ticketQuery.isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : ticketQuery.error ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-red-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                  Error Loading Parking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4">
                  We couldn't find the parking details you're looking for. The
                  entry may have been completed or doesn't exist.
                </p>
                <Button onClick={handleFindParking}>Find Parking</Button>
              </CardContent>
            </Card>
          ) : billQuery.data ? (
            // Exit bill view
            <Card className="print:shadow-none" id="printable-bill">
              <CardHeader className="border-b text-center">
                <CardTitle className="text-2xl">Parking Bill</CardTitle>
              </CardHeader>
              <CardContent className="py-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="font-medium">License Plate:</div>
                  <div>{billQuery.data.plateNumber}</div>
                </div>
                

                <div className="flex justify-between items-center">
                  <div className="font-medium">Parking Location:</div>
                  <div>{billQuery.data.parkingCode}</div>
                </div>
                

                <div className="flex justify-between items-center">
                  <div className="font-medium">Entry Time:</div>
                  <div>{formatDate(billQuery.data.entryDateTime)}</div>
                </div>
                

                <div className="flex justify-between items-center">
                  <div className="font-medium">Exit Time:</div>
                  <div>{formatDate(billQuery.data.exitDateTime)}</div>
                </div>
                

                <div className="flex justify-between items-center">
                  <div className="font-medium">Duration:</div>
                  <div>{billQuery.data.durationHours.toFixed(2)} hours</div>
                </div>
                

                <div className="flex justify-between items-center">
                  <div className="font-medium">Rate Per Hour:</div>
                  <div>${billQuery.data.chargingFeePerHour.toFixed(2)}</div>
                </div>
                

                <div className="flex justify-between items-center text-lg font-bold">
                  <div>Total Amount:</div>
                  <div>${billQuery.data.totalCharged.toFixed(2)}</div>
                </div>

                <div className="pt-6 text-center text-sm text-muted-foreground">
                  <p>Thank you for using our parking service!</p>
                  <p>Transaction ID: {billQuery.data.id}</p>
                </div>
              </CardContent>
              <CardFooter className="border-t flex justify-between print:hidden">
                <Button variant="outline" onClick={handleBackToDashboard}>
                  Back to Dashboard
                </Button>
                <Button onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Bill
                </Button>
              </CardFooter>
            </Card>
          ) : ticketQuery.data ? (
            // Entry ticket view
            <Card className="print:shadow-none" id="printable-ticket">
              <CardHeader className="border-b text-center">
                <CardTitle className="text-2xl">Parking Ticket</CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-6">
                    <Car className="h-16 w-16 text-primary" />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Car className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">License Plate:</span>
                    </div>
                    <span>{ticketQuery.data.plateNumber}</span>
                  </div>
                  

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Parking Location:</span>
                    </div>
                    <span>
                      {ticketQuery.data.parkingName ||
                        ticketQuery.data.parkingCode}
                    </span>
                  </div>
                  

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Entry Time:</span>
                    </div>
                    <span>{formatDate(ticketQuery.data.entryDateTime)}</span>
                  </div>
                  

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Elapsed Time:</span>
                    </div>
                    <span>
                      {calculateElapsedTime(ticketQuery.data.entryDateTime)}
                    </span>
                  </div>
                  

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CircleDollarSign className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Rate Per Hour:</span>
                    </div>
                    <span>
                      ${ticketQuery.data.chargingFeePerHour.toFixed(2)}
                    </span>
                  </div>
                  

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CircleDollarSign className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Estimated Cost:</span>
                    </div>
                    <span>
                      $
                      {calculateEstimatedCost(
                        ticketQuery.data.entryDateTime,
                        ticketQuery.data.chargingFeePerHour
                      )}
                    </span>
                  </div>

                  <div className="pt-6 text-center text-sm text-muted-foreground">
                    <p>Please keep this ticket safe for your exit.</p>
                    <p>Ticket ID: {ticketQuery.data.id}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t flex justify-between print:hidden">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Ticket
                </Button>
                <Button
                  onClick={() => setIsExitDialogOpen(true)}
                  disabled={exitMutation.isPending}
                >
                  {exitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Register Exit"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : null}
        </main>

        {/* Exit Confirmation Dialog */}
        <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Vehicle Exit</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to register your vehicle's exit? This will
                calculate your final parking fee based on your entry time.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleExitConfirm}>
                Confirm Exit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </LayoutCustomer>
  );
};

export default CustomerEntryDetails;
