import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Mail, MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-[#F2F5FF]">
      <Header />
      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-12 items-start"
        >
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-3xl text-[#F2F5FF]">
                  Contact Us
                </h1>
                <p className="text-[#A8B0C4]">We'd love to hear from you</p>
              </div>
            </div>
            <p className="text-[#A8B0C4] text-base leading-relaxed mb-8">
              Whether you have questions about pricing, need a demo, or just
              want to chat about AI — our team is here to help.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: <Mail className="w-4 h-4" />,
                  label: "Email",
                  value: "hello@nexaai.com",
                },
                {
                  icon: <MessageSquare className="w-4 h-4" />,
                  label: "Support",
                  value: "support@nexaai.com",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-[#11182A]"
                >
                  <span className="text-[#8B5CF6]">{item.icon}</span>
                  <div>
                    <p className="text-[#A8B0C4] text-xs">{item.label}</p>
                    <p className="text-[#F2F5FF] text-sm font-medium">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="p-8 rounded-2xl border border-white/10 bg-[#11182A]">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-ocid="contact.success_state"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="font-heading font-bold text-xl text-[#F2F5FF] mb-2">
                    Thanks! We'll be in touch.
                  </h2>
                  <p className="text-[#A8B0C4] text-sm">
                    We typically respond within one business day.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  data-ocid="contact.panel"
                >
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-1.5"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Your full name"
                      className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 focus:border-[#8B5CF6]/50"
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-1.5"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="you@company.com"
                      className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 focus:border-[#8B5CF6]/50"
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="message"
                      className="text-[#A8B0C4] text-xs uppercase tracking-wider mb-1.5"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="Tell us how we can help..."
                      className="bg-[#070A12] border-white/10 text-[#F2F5FF] placeholder:text-[#A8B0C4]/50 min-h-32 resize-none focus:border-[#8B5CF6]/50"
                      data-ocid="contact.textarea"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white border-0 hover:opacity-90 h-11"
                    data-ocid="contact.submit_button"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
