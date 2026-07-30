import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, CheckSquare } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast as sonner } from "sonner";

type UserProfileData = {
  userDetails: {
    _id: string;
    fullname: string;
    username: string;
    email: string;
    roll_no: string;
    phone_number: string;
  };
  bookedItems: { _id: string; name: string }[];
};

const StudentProfile: React.FC = () => {
  const { wrapApiCall } = useAuth();
  const queryClient = useQueryClient();

  const fetchUserProfile = async (): Promise<UserProfileData> => {
    const response = await wrapApiCall(() => api.get("/users/current-user"));
    return response?.data?.data || response?.data || response;
  };

  const { data: profileData, isLoading, error } = useQuery<UserProfileData>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    refetchOnWindowFocus: false,
  });

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    roll_no: "",
    phone_number: "",
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (profileData?.userDetails) {
      const u = profileData.userDetails;
      setForm({
        fullname: u.fullname ?? "",
        username: u.username ?? "",
        roll_no: u.roll_no ?? "",
        phone_number: u.phone_number ?? "",
      });
    }
  }, [profileData]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateUserApi = async (payload: typeof form) => {
    const res = await wrapApiCall(() => api.post("/users/update-account-details", payload));
    return res?.data?.data || res?.data || res;
  };

  const mutation = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      sonner.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setEditMode(false);
    },
    onError: (err: any) => {
      console.error("Update failed:", err);
      sonner.error(err.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSave = async () => {
    try {
      await mutation.mutateAsync(form);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 text-center">
        <p className="text-xl">Loading profile...</p>
      </div>
    </div>
  );

  if (error || !profileData) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 text-center">
        <p className="text-xl text-destructive">Error loading profile data</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["userProfile"] })} className="mt-4">
          Retry
        </Button>
      </div>
    </div>
  );

  const profile = profileData.userDetails;
  const bookedItems = profileData.bookedItems ?? [];
  const initials = (profile.fullname || "")
    .split(" ")
    .map((s) => s[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarFallback className="bg-primary text-white text-3xl font-bold">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            {editMode ? (
              <div className="space-y-4">
                <Input value={form.fullname} onChange={(e) => handleChange("fullname", e.target.value)} placeholder="Full Name" />
                <Input value={form.username} onChange={(e) => handleChange("username", e.target.value)} placeholder="Username" />
                <Input value={form.roll_no} onChange={(e) => handleChange("roll_no", e.target.value)} placeholder="Roll Number" />
                <Input value={form.phone_number} onChange={(e) => handleChange("phone_number", e.target.value)} placeholder="Phone Number" />
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold">{profile.fullname}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
                <p className="text-muted-foreground">{profile.roll_no}</p>

                <div className="flex flex-col md:flex-row gap-4 text-muted-foreground mt-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {profile.phone_number}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              {editMode ? (
                <>
                  <Button onClick={handleSave} disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditMode(false);
                      if (profileData?.userDetails) {
                        const u = profileData.userDetails;
                        setForm({
                          fullname: u.fullname ?? "",
                          username: u.username ?? "",
                          roll_no: u.roll_no ?? "",
                          phone_number: u.phone_number ?? "",
                        });
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
              )}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare size={18} /> My Booked Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookedItems.length > 0 ? (
              <div className="space-y-2">
                {bookedItems.map((item) => (
                  <div key={item._id} className="p-3 border rounded-md">
                    {item.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No items booked</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentProfile;