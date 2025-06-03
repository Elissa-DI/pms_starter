import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth";

export type SidebarItem = {
  icon: LucideIcon;
  label: string;
  to: string;
};

export default function Sidebar({
  expanded,
  setExpanded,
  activeSection,
  onSectionChange,
  items,
}: {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  items: SidebarItem[];
}) {
  const handleResize = useCallback(() => {
    if (window.innerWidth > 468 && window.innerWidth < 1024) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, [setExpanded]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <div
      className={`bg-background border-r border-border h-screen p-4 flex flex-col ${
        expanded ? "w-64" : "w-20"
      } transition-all duration-300`}
    >
      <div className="flex items-center mb-8 justify-between">
        <div className="flex items-center">
          <img src="/images/pic.png" alt="Logo" className="w-10 h-10 mr-2" />
          {expanded && (
            <span className="text-2xl font-bold text-primary">PMS</span>
          )}
        </div>
      </div>

      <nav className="space-y-2 flex-grow">
        {items.map((item) => (
          <SidebarLink
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            isActive={activeSection === item.to}
            onClick={() => onSectionChange(item.to)}
            expanded={expanded}
          />
        ))}
      </nav>

      <Button
        variant="ghost"
        onClick={logout}
        className={`relative flex items-center space-x-2 p-2 rounded-lg group text-muted-foreground hover:bg-accent mt-4 ${
          expanded ? "justify-start" : "justify-center"
        }`}
      >
        <div className={`flex items-center ${expanded ? "mr-2" : "mx-auto"}`}>
          <LogOut className="w-6 h-6" />
        </div>
        {expanded && <span>Logout</span>}
        {!expanded && (
          <div className="absolute left-full -top-10 group-hover:top-2 rounded-md px-2 py-1 ml-6 bg-primary/10 text-primary text-sm invisible opacity-0 -translate-x-3 transition-all duration-800 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
            Logout
          </div>
        )}
      </Button>
    </div>
  );
}

function SidebarLink({
  icon: Icon,
  label,
  to,
  isActive,
  onClick,
  expanded,
}: {
  icon: LucideIcon;
  label: string;
  to: string;
  isActive: boolean;
  onClick: () => void;
  expanded: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative flex items-center space-x-2 p-2 rounded-lg group ${
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent"
      } ${expanded ? "justify-start" : "justify-center"}`}
    >
      <div className={`flex items-center ${expanded ? "mr-2" : "mx-auto"}`}>
        <Icon className="w-6 h-6" />
      </div>
      {expanded && <span>{label}</span>}
      {!expanded && (
        <div className="absolute left-full -top-10 group-hover:top-2 rounded-md px-2 py-1 ml-6 bg-primary/10 text-primary text-sm invisible opacity-0 -translate-x-3 transition-all duration-800 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
          {label}
        </div>
      )}
    </Link>
  );
}
