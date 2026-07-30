import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EquipmentCard from "@/components/EquipmentCard";
import { Gamepad2, Dumbbell, Target, UserCircle } from "lucide-react";

const Index = () => {
  const equipmentData = [
    {
      name: "Table Tennis",
      status: "in-use" as const,
      currentUser: "Rahul Sharma",
      contact: "+91 98765 43210",
      timeUsed: "45 mins",
      icon: <Gamepad2 className="w-6 h-6 text-white" />,
    },
    {
      name: "Snooker Table",
      status: "available" as const,
      icon: <Target className="w-6 h-6 text-white" />,
    },
    {
      name: "Badminton Set",
      status: "in-use" as const,
      currentUser: "Priya Patel",
      contact: "+91 87654 32109",
      timeUsed: "30 mins",
      icon: <Dumbbell className="w-6 h-6 text-white" />,
    },
    {
      name: "Chess Set",
      status: "available" as const,
      icon: <UserCircle className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      <section id="equipment" className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm font-semibold">Real-Time Status</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Available Equipment
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Check what is available right now and who's using it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            {equipmentData.map((equipment, index) => (
              <EquipmentCard key={index} {...equipment} />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p>&copy; 2025 Smart SAC Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
