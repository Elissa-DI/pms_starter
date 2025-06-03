// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// import LayoutAdmin from "@/components/LayoutAdmin";
// import {
//   getAllParkings,
//   createParking,
//   deleteParking,
//   updateParking,  // <-- new import, you need to implement this in your service
// } from "@/services/parking.service";

// const AdminSlotsPage = () => {
//   const queryClient = useQueryClient();

//   // Form state for add new parking
//   const [form, setForm] = useState({
//     code: "",
//     parkingName: "",
//     nbrAvailableSpaces: "",
//     location: "",
//     chargingFeePerHour: "",
//   });

//   // State for edit dialog
//   const [editForm, setEditForm] = useState({
//     code: "",
//     parkingName: "",
//     nbrAvailableSpaces: "",
//     location: "",
//     chargingFeePerHour: "",
//   });

//   const [isEditOpen, setIsEditOpen] = useState(false);

//   // Load all parkings
//   const { data: parkings = [], isLoading } = useQuery({
//     queryKey: ["parkings"],
//     queryFn: getAllParkings,
//   });

//   // Add mutation
//   const { mutate: addParking } = useMutation({
//     mutationFn: createParking,
//     onSuccess: () => {
//       toast.success("Parking added!");
//       queryClient.invalidateQueries({ queryKey: ["parkings"] });
//       setForm({
//         code: "",
//         parkingName: "",
//         nbrAvailableSpaces: "",
//         location: "",
//         chargingFeePerHour: "",
//       });
//     },
//   });

//   // Delete mutation
//   const { mutate: removeParking } = useMutation({
//     mutationFn: deleteParking,
//     onSuccess: () => {
//       toast.success("Parking removed!");
//       queryClient.invalidateQueries({ queryKey: ["parkings"] });
//     },
//   });

//   // Update mutation
//   const { mutate: editParking } = useMutation({
//     mutationFn: updateParking,
//     onSuccess: () => {
//       toast.success("Parking updated!");
//       queryClient.invalidateQueries({ queryKey: ["parkings"] });
//       setIsEditOpen(false);
//     },
//   });

//   // Add parking submit handler
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     addParking({
//       code: form.code,
//       parkingName: form.parkingName,
//       nbrAvailableSpaces: parseInt(form.nbrAvailableSpaces, 10),
//       location: form.location,
//       chargingFeePerHour: parseFloat(form.chargingFeePerHour),
//     });
//   };

//   // Edit parking submit handler
//   const handleEditSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     editParking({
//       code: editForm.code, // assuming code is the id and immutable
//       parkingName: editForm.parkingName,
//       nbrAvailableSpaces: parseInt(editForm.nbrAvailableSpaces, 10),
//       location: editForm.location,
//       chargingFeePerHour: parseFloat(editForm.chargingFeePerHour),
//     });
//   };

//   // Open edit dialog and populate form
//   const openEditDialog = (p: typeof form) => {
//     setEditForm({
//       code: p.code,
//       parkingName: p.parkingName,
//       nbrAvailableSpaces: p.nbrAvailableSpaces.toString(),
//       location: p.location,
//       chargingFeePerHour: p.chargingFeePerHour.toString(),
//     });
//     setIsEditOpen(true);
//   };

//   return (
//     <LayoutAdmin>
//       <div className="p-6">
//         {/* Add Parking */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">Manage Parking Slots</h2>
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button>Add Parking</Button>
//             </DialogTrigger>
//             <DialogContent>
//               <form onSubmit={handleSubmit} className="grid gap-4">
//                 {[
//                   ["code", "Code"],
//                   ["parkingName", "Parking Name"],
//                   ["location", "Location"],
//                   ["nbrAvailableSpaces", "Available Spaces"],
//                   ["chargingFeePerHour", "Fee per Hour"],
//                 ].map(([key, label]) => (
//                   <div key={key} className="grid gap-2">
//                     <Label htmlFor={key}>{label}</Label>
//                     <Input
//                       id={key}
//                       required
//                       value={form[key as keyof typeof form]}
//                       onChange={(e) =>
//                         setForm({ ...form, [key]: e.target.value })
//                       }
//                     />
//                   </div>
//                 ))}
//                 <Button type="submit">Submit</Button>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Edit Parking Dialog */}
//         <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
//           <DialogContent>
//             <form onSubmit={handleEditSubmit} className="grid gap-4">
//               {[
//                 ["code", "Code"],
//                 ["parkingName", "Parking Name"],
//                 ["location", "Location"],
//                 ["nbrAvailableSpaces", "Available Spaces"],
//                 ["chargingFeePerHour", "Fee per Hour"],
//               ].map(([key, label]) => (
//                 <div key={key} className="grid gap-2">
//                   <Label htmlFor={`edit-${key}`}>{label}</Label>
//                   <Input
//                     id={`edit-${key}`}
//                     required
//                     value={editForm[key as keyof typeof editForm]}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, [key]: e.target.value })
//                     }
//                     // Disable editing code if you want code immutable
//                     disabled={key === "code"}
//                   />
//                 </div>
//               ))}
//               <div className="flex justify-end gap-2">
//                 <Button variant="outline" onClick={() => setIsEditOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">Save Changes</Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>

//         {/* Parking cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {isLoading ? (
//             <p>Loading...</p>
//           ) : (
//             parkings.map((p) => (
//               <Card key={p.code}>
//                 <CardHeader>
//                   <CardTitle>{p.parkingName}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <p>
//                     <strong>Code:</strong> {p.code}
//                   </p>
//                   <p>
//                     <strong>Available:</strong> {p.nbrAvailableSpaces}
//                   </p>
//                   <p>
//                     <strong>Location:</strong> {p.location}
//                   </p>
//                   <p>
//                     <strong>Fee/hr:</strong> ${p.chargingFeePerHour}
//                   </p>

//                   <div className="flex gap-2">
//                     <Button onClick={() => openEditDialog(p)}>View / Edit</Button>
//                     <Button
//                       variant="destructive"
//                       onClick={() => removeParking(p.code)}
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>
//     </LayoutAdmin>
//   );
// };

// export default AdminSlotsPage;
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import LayoutAdmin from "@/components/LayoutAdmin";
import { getAllParkings, createParking, updateParking, deleteParking } from "@/services/parking.service";

import SlotCard from "@/components/SlotCard";

type Parking = {
  code: string;
  parkingName: string;
  nbrAvailableSpaces: number;
  location: string;
  chargingFeePerHour: number;
};

const AdminSlotsPage = () => {
  const queryClient = useQueryClient();
  const { data: parkings = [], isLoading } = useQuery({
    queryKey: ["parkings"],
    queryFn: getAllParkings,
  });

  const [newForm, setNewForm] = useState({
    code: "",
    parkingName: "",
    nbrAvailableSpaces: "",
    location: "",
    chargingFeePerHour: "",
  });

  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);

  const [editForm, setEditForm] = useState({
    code: "",
    parkingName: "",
    nbrAvailableSpaces: "",
    location: "",
    chargingFeePerHour: "",
  });

  const { mutate: addParking, isLoading: adding } = useMutation({
    mutationFn: createParking,
    onSuccess: () => {
      toast.success("Parking added!");
      queryClient.invalidateQueries(["parkings"]);
      setNewForm({
        parkingName: "",
        nbrAvailableSpaces: "",
        location: "",
        chargingFeePerHour: "",
      });
    },
    onError: () => {
      toast.error("Failed to add parking.");
    },
  });

  const { mutate: editParking, isLoading: editing } = useMutation({
    mutationFn: updateParking,
    onSuccess: () => {
      toast.success("Parking updated!");
      queryClient.invalidateQueries(["parkings"]);
      setSelectedParking(null);
    },
    onError: () => {
      toast.error("Failed to update parking.");
    },
  });

  const { mutate: removeParking, isLoading: deleting } = useMutation({
    mutationFn: deleteParking,
    onSuccess: () => {
      toast.success("Parking deleted!");
      queryClient.invalidateQueries(["parkings"]);
      setSelectedParking(null);
    },
    onError: () => {
      toast.error("Failed to delete parking.");
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addParking({
      parkingName: newForm.parkingName,
      nbrAvailableSpaces: parseInt(newForm.nbrAvailableSpaces, 10),
      location: newForm.location,
      chargingFeePerHour: parseFloat(newForm.chargingFeePerHour),
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParking) return;
    editParking({
      parkingName: editForm.parkingName,
      nbrAvailableSpaces: parseInt(editForm.nbrAvailableSpaces, 10),
      location: editForm.location,
      chargingFeePerHour: parseFloat(editForm.chargingFeePerHour),
    });
  };

  const openEditModal = (parking: Parking) => {
    setSelectedParking(parking);
    setEditForm({
      code: parking.code,
      parkingName: parking.parkingName,
      nbrAvailableSpaces: parking.nbrAvailableSpaces.toString(),
      location: parking.location,
      chargingFeePerHour: parking.chargingFeePerHour.toString(),
    });
  };

  return (
    <LayoutAdmin>
      <div className="page-container p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Parking Slots</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Parking</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Parking</DialogTitle>
                <DialogDescription>
                  Fill out the details to add a new parking slot.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddSubmit} className="grid gap-4 mt-4">
                {[
                  ["code", "Code"],
                  ["parkingName", "Parking Name"],
                  ["location", "Location"],
                  ["nbrAvailableSpaces", "Available Spaces"],
                  ["chargingFeePerHour", "Fee per Hour"],
                ].map(([key, label]) => (
                  <div key={key} className="grid gap-1">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      required
                      type={
                        key === "nbrAvailableSpaces"
                          ? "number"
                          : key === "chargingFeePerHour"
                          ? "number"
                          : "text"
                      }
                      value={newForm[key as keyof typeof newForm]}
                      onChange={(e) =>
                        setNewForm({ ...newForm, [key]: e.target.value })
                      }
                      min={key === "nbrAvailableSpaces" ? 0 : undefined}
                      step={key === "chargingFeePerHour" ? 0.01 : undefined}
                    />
                  </div>
                ))}
                <Button type="submit" disabled={adding} className="mt-2">
                  {adding ? "Adding..." : "Add Parking"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p>Loading parkings...</p>
          ) : parkings.length === 0 ? (
            <p>No parking slots found.</p>
          ) : (
            parkings.map((p) => (
              <SlotCard key={p.code} parking={p} onClick={openEditModal} />
            ))
          )}
        </div>

        <Dialog
          open={!!selectedParking}
          onOpenChange={(open) => !open && setSelectedParking(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Parking Slot</DialogTitle>
              <DialogDescription>Update the parking slot details below.</DialogDescription>
            </DialogHeader>

            {selectedParking && (
              <form onSubmit={handleEditSubmit} className="grid gap-4 mt-4">

                <div className="grid gap-1">
                  <Label htmlFor="parkingName">Parking Name</Label>
                  <Input
                    id="parkingName"
                    required
                    value={editForm.parkingName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, parkingName: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    required
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="nbrAvailableSpaces">Available Spaces</Label>
                  <Input
                    id="nbrAvailableSpaces"
                    required
                    type="number"
                    min={0}
                    value={editForm.nbrAvailableSpaces}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nbrAvailableSpaces: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="chargingFeePerHour">Fee per Hour</Label>
                  <Input
                    id="chargingFeePerHour"
                    required
                    type="number"
                    min={0}
                    step={0.01}
                    value={editForm.chargingFeePerHour}
                    onChange={(e) =>
                      setEditForm({ ...editForm, chargingFeePerHour: e.target.value })
                    }
                  />
                </div>

                <DialogFooter className="flex justify-between">
                  <Button
                    variant="destructive"
                    onClick={() => selectedParking && removeParking(selectedParking.code)}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                  <Button type="submit" disabled={editing}>
                    {editing ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </LayoutAdmin>
  );
};

export default AdminSlotsPage;
