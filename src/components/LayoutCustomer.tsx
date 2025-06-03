import { useState } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Home, Map } from "lucide-react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import type { SidebarItem } from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

interface LayoutCustomerProps {
  children?: ReactNode;
}

export default function LayoutCustomer({ children }: LayoutCustomerProps) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const { user, loading } = useAuth();

  

  const titles: Record<string, string> = {
    "/customer/dashboard": "Dashboard",
    "/customer/parkings": "Available Parkings",
    "/customer/checkout/:id": "Checkout",
  };

  // In LayoutCustomer.tsx
const getTitle = (path: string) => {
  if (path.startsWith("/customer/checkout/")) {
    return "Checkout";
  }
  return titles[path] || "Dashboard";
};

  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: "Dashboard", to: "/customer/dashboard" },
    { icon: Map, label: "Available Parkings", to: "/customer/parkings" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "CUSTOMER") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        expanded={expanded}
        setExpanded={setExpanded}
        activeSection={location.pathname}
        onSectionChange={() => {}}
        items={sidebarItems}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getTitle(location.pathname)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background md:p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
