import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="relative group p-6 rounded-xl border border-white/10 bg-[#11182A] hover:scale-105 transition-all duration-200 overflow-hidden">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(34,211,238,0.08))",
        }}
      />
      <div className="relative">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B5CF6]/20 to-[#22D3EE]/20 border border-white/10 flex items-center justify-center mb-4 text-[#8B5CF6]">
          {icon}
        </div>
        <h3 className="font-heading font-semibold text-[#F2F5FF] text-lg mb-2">
          {title}
        </h3>
        <p className="text-[#A8B0C4] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
