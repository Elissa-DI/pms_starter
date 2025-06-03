/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getAvailableParkingSpaces,
  registerCarEntry,
} from "@/services/customer.service";
import type { EntryTicket, ParkingLot } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { Loader2, MapPin, Car, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LayoutCustomer from "@/components/LayoutCustomer";

const CustomerParkingView = () => {
  const navigate = useNavigate();
  const [selectedParking, setSelectedParking] = useState<ParkingLot | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [plateNumber, setPlateNumber] = useState("");
   const [generatedTicket, setGeneratedTicket] = useState<EntryTicket | null>(null);
   const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);

  // Fetch available parking spaces
  const { data: parkingLots, isLoading } = useQuery({
    queryKey: ["availableParkings"],
    queryFn: getAvailableParkingSpaces,
  });

  // Register car entry mutation
  // const registerEntryMutation = useMutation({
  //   mutationFn: (data: { plateNumber: string; parkingCode: string }) =>
  //     registerCarEntry(data.plateNumber, data.parkingCode),
  //   onSuccess: (data) => {
  //     toast("Your parking ticket has been generated.");
  //     setIsDialogOpen(false);
  //     // Navigate to entry details page with the entry ID
  //     navigate(`/customer/checkout/${data.id}`);
  //   },
  //   onError: (error: Error) => {
  //     toast.error("Could not register your entry. Please try again.");
  //   },
  // });

  const registerEntryMutation = useMutation({
    mutationFn: (data: { plateNumber: string; parkingCode: string }) =>
      registerCarEntry(data.plateNumber, data.parkingCode),
    onSuccess: (data) => {
      toast.success("Your parking ticket has been generated.");
      setIsDialogOpen(false);
      setGeneratedTicket(data);
      setIsTicketDialogOpen(true);
    },
    onError: (error: Error) => {
      toast.error("Could not register your entry. Please try again.");
    },
  });

  const handleContinueToCheckout = () => {
    if (generatedTicket?.id) {
      setIsTicketDialogOpen(false);
      navigate(`/customer/checkout/${generatedTicket.id}`);
    }
  };

  const handleParkingSelect = (parking: ParkingLot) => {
    setSelectedParking(parking);
    setIsDialogOpen(true);
  };

  const handleRegisterEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedParking?.code) {
      registerEntryMutation.mutate({
        plateNumber: plateNumber,
        parkingCode: selectedParking.code,
      });
    }
  };
  return (
    <LayoutCustomer>
      <div className="min-h-screen bg-background">

        <main className=" mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Available Parking Spaces</h1>
            <p className="text-muted-foreground mt-2">
              Select a parking lot to register your vehicle
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : parkingLots && parkingLots.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {parkingLots.map((parking) => (
                <Card
                  key={parking.code}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle>{parking.parkingName}</CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {parking.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Car className="h-5 w-5 mr-2 text-primary" />
                          <span className="font-medium">Available Spaces:</span>
                        </div>
                        <span className="font-bold text-lg">
                          {parking.nbrAvailableSpaces}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-primary" />
                          <span className="font-medium">Rate Per Hour:</span>
                        </div>
                        <span className="font-bold text-lg">
                          ${parking.chargingFeePerHour.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-primary/5 border-t">
                    <Button
                      className="w-full"
                      onClick={() => handleParkingSelect(parking)}
                      disabled={parking.nbrAvailableSpaces <= 0}
                    >
                      {parking.nbrAvailableSpaces > 0
                        ? "Park Here"
                        : "No Spaces Available"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">
                No Parking Spaces Available
              </h3>
              <p className="text-muted-foreground">
                There are currently no available parking spaces. Please check
                back later.
              </p>
            </div>
          )}
        </main>

        {/* Entry Registration Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register Vehicle Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegisterEntry}>
              <div className="py-4">
                <div className="mb-4">
                  <h4 className="font-medium">Parking Information</h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    <div>{selectedParking?.parkingName}</div>
                    <div>{selectedParking?.location}</div>
                    <div className="mt-1">
                      Rate: ${selectedParking?.chargingFeePerHour.toFixed(2)}{" "}
                      per hour
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="plateNumber">License Plate Number</Label>
                  <Input
                    id="plateNumber"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="e.g., ABC1234"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Please enter your vehicle's license plate number to register
                    entry
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    registerEntryMutation.isPending || !plateNumber.trim()
                  }
                >
                  {registerEntryMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Entry"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

         <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Your Parking Ticket</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {generatedTicket && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">License Plate:</span>
                    <span>{generatedTicket.plateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Parking Location:</span>
                    <span>{generatedTicket.parkingName || generatedTicket.parkingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Entry Time:</span>
                    <span>{new Date(generatedTicket.entryDateTime).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Rate:</span>
                    <span>${generatedTicket.chargingFeePerHour?.toFixed(2)}/hour</span>
                  </div>
                  <div className="pt-4 text-sm text-muted-foreground">
                    <p>Please keep this information for your records.</p>
                    <p>Ticket ID: {generatedTicket.id}</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleContinueToCheckout} className="w-full">
                Continue to Checkout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </LayoutCustomer>
  );
};

export default CustomerParkingView;
