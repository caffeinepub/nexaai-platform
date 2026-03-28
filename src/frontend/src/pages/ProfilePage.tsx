import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Save, UserCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useActor } from "../hooks/useActor";
import { getCurrentUser, isAuthenticated } from "../hooks/useAuth";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();
  const currentUser = getCurrentUser();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/login" });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getMyProfile()
      .then((profile) => {
        if (profile) {
          setDisplayName(profile.displayName || "");
          setBio(profile.bio || "");
        } else {
          // pre-fill name from session
          setDisplayName(currentUser?.name || "");
        }
      })
      .catch(() => {
        setDisplayName(currentUser?.name || "");
      })
      .finally(() => setLoading(false));
  }, [actor, isFetching, currentUser?.name]);

  const handleSave = async () => {
    if (!actor) {
      toast.error("Not connected. Please try again.");
      return;
    }
    setSaving(true);
    try {
      await actor.updateUserProfile(displayName, bio);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (() => {
    const name = displayName || currentUser?.name || currentUser?.email || "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  })();

  return (
    <div className="min-h-screen bg-[#070A12] flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* Avatar */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center mb-4 shadow-lg shadow-[#8B5CF6]/30">
                <span className="text-white font-heading font-bold text-3xl">
                  {initials}
                </span>
              </div>
              <h1 className="font-heading font-bold text-2xl text-[#F2F5FF] mb-1">
                {displayName || currentUser?.name || "Your Profile"}
              </h1>
              <p className="text-[#A8B0C4] text-sm">{currentUser?.email}</p>
            </div>

            {/* Form card */}
            <div className="rounded-2xl border border-white/10 bg-[#11182A] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <UserCircle className="w-5 h-5 text-[#8B5CF6]" />
                <h2 className="font-heading font-semibold text-[#F2F5FF] text-lg">
                  Edit Profile
                </h2>
              </div>

              {loading ? (
                <div
                  className="flex items-center justify-center py-12"
                  data-ocid="profile.loading_state"
                >
                  <Loader2 className="w-6 h-6 animate-spin text-[#8B5CF6]" />
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Email (read-only) */}
                  <div className="space-y-1.5">
                    <Label className="text-[#A8B0C4] text-sm">Email</Label>
                    <Input
                      value={currentUser?.email || ""}
                      readOnly
                      className="bg-[#070A12] border-white/10 text-[#A8B0C4] cursor-not-allowed"
                      data-ocid="profile.input"
                    />
                  </div>

                  {/* Display Name */}
                  <div className="space-y-1.5">
                    <Label className="text-[#A8B0C4] text-sm">
                      Display Name
                    </Label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                      className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 focus:border-[#8B5CF6]/50"
                      data-ocid="profile.input"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <Label className="text-[#A8B0C4] text-sm">Bio</Label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 focus:border-[#8B5CF6]/50 resize-none"
                      data-ocid="profile.textarea"
                    />
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90 font-semibold"
                    data-ocid="profile.submit_button"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 w-4 h-4" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
