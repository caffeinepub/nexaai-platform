import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import {
  Check,
  Copy,
  KeyRound,
  Loader2,
  Plus,
  Rocket,
  Shield,
  Trash2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { LicenseKey } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { isAuthenticated } from "../hooks/useAuth";

function CopyableKey({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const short = `${value.slice(0, 14)}...${value.slice(-6)}`;

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-1.5 font-mono text-xs text-[#A8B0C4] hover:text-[#F2F5FF] transition-colors group"
    >
      <span className="group-hover:text-[#22D3EE] transition-colors">
        {short}
      </span>
      {copied ? (
        <Check className="w-3 h-3 text-emerald-400" />
      ) : (
        <Copy className="w-3 h-3 opacity-50 group-hover:opacity-100" />
      )}
    </button>
  );
}

function NewKeyBox({ keyValue }: { keyValue: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(keyValue);
    setCopied(true);
    toast.success("Key copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5"
    >
      <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2 font-medium">
        ✓ Key Generated
      </p>
      <div className="flex items-center gap-3 bg-[#070A12] rounded-lg px-4 py-3 border border-white/10">
        <code className="font-mono text-sm text-[#F2F5FF] flex-1 break-all">
          {keyValue}
        </code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-medium hover:bg-[#8B5CF6]/30 transition-colors"
        >
          {copied ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-[#A8B0C4] text-xs mt-2">
        Share this key with the user. It can only be activated once.
      </p>
    </motion.div>
  );
}

export default function AdminPage() {
  const { actor, isFetching } = useActor();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  // If caffeineAdminToken is in URL, the actor is already initialized with admin rights
  const hasCaffeineToken =
    typeof window !== "undefined" &&
    window.location.hash.includes("caffeineAdminToken");
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [revokingKey, setRevokingKey] = useState<string | null>(null);
  const [customKeyInput, setCustomKeyInput] = useState("");
  const [addingCustomKey, setAddingCustomKey] = useState(false);
  const [groqKeyInput, setGroqKeyInput] = useState("");
  const [savingGroqKey, setSavingGroqKey] = useState(false);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor.isCallerAdmin().then(setIsAdmin);
  }, [actor, isFetching]);

  useEffect(() => {
    if ((!isAdmin && !hasCaffeineToken) || !actor || isFetching) return;
    setLoadingKeys(true);
    actor
      .getAllKeys()
      .then(setKeys)
      .catch(() => setKeys([]))
      .finally(() => setLoadingKeys(false));
  }, [isAdmin, hasCaffeineToken, actor, isFetching]);

  const handleInitialize = async () => {
    if (!actor) return;
    setInitializing(true);
    try {
      await (actor as any).initialize();
      toast.success("Initialized! AYAN key seeded. Loading admin panel...");
      // Re-check admin status after initialize
      const adminStatus = await actor.isCallerAdmin();
      setIsAdmin(adminStatus);
      if (adminStatus) {
        setLoadingKeys(true);
        actor
          .getAllKeys()
          .then(setKeys)
          .catch(() => setKeys([]))
          .finally(() => setLoadingKeys(false));
      }
    } catch (e: any) {
      toast.error(
        `Initialization failed: ${(e as any)?.message || "unknown error"}`,
      );
    } finally {
      setInitializing(false);
    }
  };

  const handleSaveGroqKey = async () => {
    if (!actor || !groqKeyInput.trim()) return;
    setSavingGroqKey(true);
    try {
      await (actor as any).setGroqApiKey(groqKeyInput.trim());
      toast.success("Groq API key updated!");
      setGroqKeyInput("");
    } catch {
      toast.error("Failed to save Groq API key.");
    } finally {
      setSavingGroqKey(false);
    }
  };

  const handleGenerateKey = async () => {
    if (!actor) return;
    setGeneratingKey(true);
    setNewKey(null);
    try {
      const key = await actor.generateKey();
      setNewKey(key);
      const updated = await actor.getAllKeys();
      setKeys(updated);
      toast.success("New license key generated!");
    } catch {
      toast.error("Failed to generate key");
    } finally {
      setGeneratingKey(false);
    }
  };

  const handleAddCustomKey = async () => {
    if (!actor || !customKeyInput.trim()) return;
    setAddingCustomKey(true);
    try {
      const result: boolean = await (actor as any).addCustomKey(
        customKeyInput.trim(),
      );
      if (result) {
        toast.success("Custom key added!");
        setCustomKeyInput("");
        const updated = await actor.getAllKeys();
        setKeys(updated);
      } else {
        toast.error("Key already exists or invalid.");
      }
    } catch {
      toast.error("Failed to add key.");
    } finally {
      setAddingCustomKey(false);
    }
  };

  const handleRevokeKey = async (key: string) => {
    if (!actor) return;
    setRevokingKey(key);
    try {
      await actor.revokeKey(key);
      const updated = await actor.getAllKeys();
      setKeys(updated);
      toast.success("Key revoked");
    } catch {
      toast.error("Failed to revoke key");
    } finally {
      setRevokingKey(null);
    }
  };

  const formatDate = (ts: bigint) => {
    const ms = Number(ts / 1_000_000n);
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncatePrincipal = (p: string) => `${p.slice(0, 8)}...${p.slice(-5)}`;

  // Not logged in
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-[#8B5CF6] mx-auto mb-4" />
          <h2 className="text-[#F2F5FF] font-heading font-bold text-xl mb-2">
            Authentication Required
          </h2>
          <p className="text-[#A8B0C4] text-sm mb-6">
            You must be logged in to access the admin panel.
          </p>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Still checking
  if (isAdmin === null && !hasCaffeineToken) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
      </div>
    );
  }

  // Logged in but not admin (and no token) -- show First Time Setup
  if (isAdmin === false && !hasCaffeineToken) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[#F2F5FF] font-heading font-bold text-2xl mb-2">
              First Time Setup
            </h2>
            <p className="text-[#A8B0C4] text-sm">
              Click Initialize to become admin and seed the AYAN license key.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-[#11182A] mb-4">
            <p className="text-[#A8B0C4] text-sm mb-4">This will:</p>
            <ul className="text-[#A8B0C4] text-sm space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Assign you as
                admin
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Seed AYAN license
                key
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Unlock full admin
                panel
              </li>
            </ul>
            <Button
              onClick={handleInitialize}
              disabled={initializing}
              className="w-full bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-white border-0 hover:opacity-90"
            >
              {initializing ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                  Initializing...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 w-4 h-4" /> Initialize App
                </>
              )}
            </Button>
          </div>

          {/* Groq API Key in setup screen */}
          <div className="p-5 rounded-2xl border border-[#8B5CF6]/30 bg-[#11182A] mb-4">
            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="font-heading font-semibold text-[#F2F5FF] text-base">
                Set Groq API Key
              </h3>
            </div>
            <p className="text-[#A8B0C4] text-xs mb-3">
              Paste your Groq key (from console.groq.com) -- saves permanently
              for all AI tools.
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={groqKeyInput}
                onChange={(e) => setGroqKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveGroqKey()}
                placeholder="gsk_..."
                className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 focus-visible:ring-[#8B5CF6]/50 flex-1 text-sm"
              />
              <Button
                onClick={handleSaveGroqKey}
                disabled={savingGroqKey || !groqKeyInput.trim()}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90 shrink-0 text-sm"
              >
                {savingGroqKey ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Key"
                )}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className="text-[#A8B0C4] hover:text-[#F2F5FF]"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const activeCount = keys.filter((k) => k.isActive).length;
  const totalCount = keys.length;
  const showInitBanner =
    isAdmin === false || (hasCaffeineToken && isAdmin === null);

  return (
    <div className="min-h-screen bg-[#070A12] text-[#F2F5FF]">
      <header className="border-b border-white/10 bg-[#0B1020] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
              NexaAI
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 text-xs">
              <Shield className="w-3 h-3 mr-1" /> Admin
            </Badge>
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#A8B0C4] hover:text-[#F2F5FF]"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F2F5FF]">
                  Admin Panel
                </h1>
                <p className="text-[#A8B0C4] text-sm">License Key Management</p>
              </div>
            </div>
          </div>

          {/* Initialize App */}
          <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-[#11182A]">
            <div className="flex items-center gap-3 mb-1">
              <Rocket className="w-5 h-5 text-[#22D3EE]" />
              <h2 className="font-heading font-semibold text-[#F2F5FF] text-lg">
                Initialize App
              </h2>
            </div>
            <p className="text-[#A8B0C4] text-sm mb-4">
              {showInitBanner
                ? "Click Initialize to become admin and seed the AYAN license key."
                : "Re-seed the AYAN license key if needed."}
            </p>
            <Button
              onClick={handleInitialize}
              disabled={initializing}
              className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-white border-0 hover:opacity-90"
            >
              {initializing ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                  Initializing...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 w-4 h-4" /> Initialize
                </>
              )}
            </Button>
          </div>

          {/* Groq API Key */}
          <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-[#11182A]">
            <div className="flex items-center gap-3 mb-1">
              <KeyRound className="w-5 h-5 text-[#8B5CF6]" />
              <h2 className="font-heading font-semibold text-[#F2F5FF] text-lg">
                Groq API Key
              </h2>
            </div>
            <p className="text-[#A8B0C4] text-sm mb-4">
              Update the AI key used for all tools
            </p>
            <div className="flex items-center gap-3">
              <Input
                type="password"
                value={groqKeyInput}
                onChange={(e) => setGroqKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveGroqKey()}
                placeholder="gsk_..."
                className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 focus-visible:ring-[#8B5CF6]/50 flex-1"
              />
              <Button
                onClick={handleSaveGroqKey}
                disabled={savingGroqKey || !groqKeyInput.trim()}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90 shrink-0"
              >
                {savingGroqKey ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 w-4 h-4" /> Save Key
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-white/10 bg-[#11182A]">
              <p className="text-[#A8B0C4] text-xs uppercase tracking-wider">
                Total Keys
              </p>
              <p className="font-heading font-bold text-2xl text-[#F2F5FF] mt-1">
                {totalCount}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#11182A]">
              <p className="text-[#A8B0C4] text-xs uppercase tracking-wider">
                Active
              </p>
              <p className="font-heading font-bold text-2xl text-emerald-400 mt-1">
                {activeCount}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#11182A]">
              <p className="text-[#A8B0C4] text-xs uppercase tracking-wider">
                Revoked / Used
              </p>
              <p className="font-heading font-bold text-2xl text-red-400 mt-1">
                {totalCount - activeCount}
              </p>
            </div>
          </div>

          {/* Generate Key */}
          <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-[#11182A]">
            <h2 className="font-heading font-semibold text-[#F2F5FF] text-lg mb-1">
              Generate License Key
            </h2>
            <p className="text-[#A8B0C4] text-sm mb-4">
              Create a new one-time license key to sell or distribute
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#A8B0C4] text-sm">
                Auto-generate a random key
              </span>
              <Button
                onClick={handleGenerateKey}
                disabled={generatingKey}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90"
              >
                {generatingKey ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                    Generating...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 w-4 h-4" /> Generate New Key
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <Input
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomKey()}
                placeholder="Enter custom key e.g. AYAN-PRO"
                className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 focus-visible:ring-[#8B5CF6]/50 flex-1"
              />
              <Button
                onClick={handleAddCustomKey}
                disabled={addingCustomKey || !customKeyInput.trim()}
                variant="outline"
                className="border-[#8B5CF6]/40 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 hover:text-[#8B5CF6] shrink-0"
              >
                {addingCustomKey ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="mr-1.5 w-4 h-4" /> Add Custom Key
                  </>
                )}
              </Button>
            </div>
            {newKey && <NewKeyBox keyValue={newKey} />}
          </div>

          {/* Keys Table */}
          <div className="rounded-2xl border border-white/10 bg-[#11182A] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-heading font-semibold text-[#F2F5FF]">
                All License Keys
              </h2>
              {loadingKeys && (
                <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6]" />
              )}
            </div>
            {keys.length === 0 && !loadingKeys ? (
              <div className="py-16 text-center">
                <KeyRound className="w-10 h-10 text-[#A8B0C4]/30 mx-auto mb-3" />
                <p className="text-[#A8B0C4] text-sm">No keys generated yet.</p>
                <p className="text-[#A8B0C4]/60 text-xs mt-1">
                  Click "Generate New Key" to create one.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-[#A8B0C4] text-xs uppercase tracking-wider">
                      Key
                    </TableHead>
                    <TableHead className="text-[#A8B0C4] text-xs uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="text-[#A8B0C4] text-xs uppercase tracking-wider hidden sm:table-cell">
                      Activated By
                    </TableHead>
                    <TableHead className="text-[#A8B0C4] text-xs uppercase tracking-wider hidden md:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="text-[#A8B0C4] text-xs uppercase tracking-wider text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((k, i) => (
                    <TableRow
                      key={k.key}
                      className="border-white/5 hover:bg-white/2"
                    >
                      <TableCell>
                        <CopyableKey value={k.key} />
                      </TableCell>
                      <TableCell>
                        {k.isActive ? (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs">
                            Active
                          </Badge>
                        ) : k.activatedBy ? (
                          <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs">
                            Used
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/15 text-red-400 border border-red-500/30 text-xs">
                            Revoked
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="font-mono text-xs text-[#A8B0C4]">
                          {k.activatedBy
                            ? truncatePrincipal(k.activatedBy.toString())
                            : "—"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-[#A8B0C4] text-xs">
                        {formatDate(k.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRevokeKey(k.key)}
                          disabled={!k.isActive || revokingKey === k.key}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-30"
                          data-ocid={`admin.delete_button.${i + 1}`}
                        >
                          {revokingKey === k.key ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
