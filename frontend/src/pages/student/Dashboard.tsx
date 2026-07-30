import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import EquipmentCard from "@/components/EquipmentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Gamepad2, Dumbbell, UserCircle, Megaphone } from "lucide-react";
import React from "react";
import { toast as sonner } from "sonner";
import { useNavigate } from "react-router-dom";

interface ApiEquipment {
  _id: string;
  name: string;
  status: "available" | "in-use" | "broken";
  user?: { fullname: string; roll_no: string; phone_number: string };
  duration?: string;
  roll_no?: string;
}

interface DashboardData {
  equipment: ApiEquipment[];
  announcements: { _id: string; heading: string; content: string; footer?: string }[];
}

const getEquipmentIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("badminton")) return <Dumbbell className="w-6 h-6 text-white" />;
  return <Gamepad2 className="w-6 h-6 text-white" />;
};

const StudentDashboard = () => {
  const { user, wrapApiCall } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showOnlyAvailable, setShowOnlyAvailable] = React.useState(true);

  const fetchDashboardData = async (): Promise<DashboardData> => {
    const response = await wrapApiCall(() => api.get("/users/dashboard"));
    return response?.data?.data || response?.data || response;
  };

  const { data: dashboardData, isLoading: isLoadingDashboard, error: dashboardError } = useQuery({
    queryKey: ["studentDashboard"],
    queryFn: fetchDashboardData,
  });

  const bookEquipmentMutation = useMutation({
    mutationFn: (equipmentId: string) =>
      wrapApiCall(() =>
        api.post("/users/book-equipment", {
          equipmentId,
          duration: "1h 30m",
        })
      ),
    onSuccess: () => {
      sonner.success("Equipment Booked!");
      queryClient.invalidateQueries({ queryKey: ["studentDashboard"] });
    },
    onError: (error: any) => {
      sonner.error("Failed to book equipment");
      console.error("Booking error:", error);
    },
  });

  const handleBookEquipment = (id: string) => bookEquipmentMutation.mutate(id);

  if (isLoadingDashboard)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 text-center">
          <p className="text-xl">Loading your dashboard...</p>
        </div>
      </div>
    );

  if (dashboardError || !dashboardData)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 text-center">
          <p className="text-xl text-destructive">Could not load dashboard data.</p>
        </div>
      </div>
    );

  const equipment = dashboardData?.equipment || [];
  const announcements = dashboardData?.announcements || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container mx-auto px-4 md:px-6 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Welcome back, {user && "fullname" in user ? user.fullname : "Student"}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card
            onClick={() => navigate("/student/profile")}
            className="cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all rounded-lg shadow-md hover:shadow-lg"
          >
            <CardHeader className="flex flex-col items-center p-4 space-y-2 text-center">
              <UserCircle className="w-6 h-6 text-primary" />
              <CardTitle className="text-sm font-semibold">My Profile</CardTitle>
            </CardHeader>
          </Card>

          <Card
            onClick={() => navigate("/student/dashboard#equipment")}
            className="cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all rounded-lg shadow-md hover:shadow-lg"
          >
            <CardHeader className="flex flex-col items-center p-4 space-y-2 text-center">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <CardTitle className="text-sm font-semibold">Equipment Status</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="equipment" className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full mb-3 border border-primary/20">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-xs font-semibold">Real-Time Status</span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-center md:text-left">
                Equipment Status
              </h2>

              <div className="flex items-center gap-2 bg-card p-2 rounded-lg shadow-inner">
                <Label htmlFor="available-toggle" className="text-xs font-medium text-muted-foreground">
                  Show only available
                </Label>
                <Switch
                  id="available-toggle"
                  checked={showOnlyAvailable}
                  onCheckedChange={setShowOnlyAvailable}
                />
              </div>
            </div>
          </div>

          <div
            key={showOnlyAvailable ? "available" : "all"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in"
          >
            {equipment
              .filter((eq) => !showOnlyAvailable || eq.status === "available")
              .map((equipmentItem) => (
                <EquipmentCard
                  key={equipmentItem._id}
                  equipmentId={equipmentItem._id}
                  name={equipmentItem.name}
                  status={equipmentItem.status === "broken" ? "maintenance" : equipmentItem.status}
                  currentUser={
                    equipmentItem.user
                      ? `${equipmentItem.user.fullname} (${equipmentItem.roll_no})`
                      : undefined
                  }
                  contact={equipmentItem.user?.phone_number}
                  timeUsed={equipmentItem.duration}
                  rollNumber={equipmentItem.roll_no}
                  duration={equipmentItem.duration}
                  icon={getEquipmentIcon(equipmentItem.name)}
                  bookingText="Booking is managed by the admin team"
                  onBook={handleBookEquipment}
                />
              ))}
          </div>
        </div>
      </section>

      <section id="announcements" className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full mb-3 border border-primary/20">
              <Megaphone className="w-4 h-4" />
              <span className="text-xs font-semibold">What's New</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Announcements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {announcements.length > 0 ? (
              announcements.map((ann) => (
                <Card key={ann._id} className="animate-slide-up rounded-lg shadow-md border-l-4 border-primary">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{ann.heading}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">{ann.content}</p>
                    {ann.footer && (
                      <p className="text-xs text-muted-foreground mt-3">{ann.footer}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground md:col-span-2 p-4 bg-muted rounded-lg">
                No new announcements.
              </p>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4 md:px-6 text-center text-xs text-muted-foreground">
          <p>&copy; 2025 Smart SAC Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;