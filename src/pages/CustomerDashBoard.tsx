import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Car, Receipt } from "lucide-react";
import LayoutCustomer from "@/components/LayoutCustomer";

const CustomerDashboard = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <LayoutCustomer>
      <div className="min-h-screen flex flex-col bg-background">

        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              Welcome, {user?.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your parking activities from your dashboard
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Find Parking
                </CardTitle>
                <CardDescription>
                  Search for available parking spots near your destination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View all available parking lots with real-time space
                  availability and hourly rates.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => navigate("/customer/parkings")}
                >
                  Find Parking
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  My Parking History
                </CardTitle>
                <CardDescription>
                  View your past and current parking activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access your parking tickets, receipts, and view details of all
                  your parking sessions.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate("/customer/history")}
                  disabled
                >
                  Coming Soon
                </Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-1 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Support and information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Have questions or need assistance with your parking? Our
                  support team is here to help.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  Contact Support
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </LayoutCustomer>
  );
};

export default CustomerDashboard;
