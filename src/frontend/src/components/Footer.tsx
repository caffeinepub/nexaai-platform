import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter, Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "AI Tools", href: "/tools" },
        { label: "Pricing", href: "#" },
        { label: "Changelog", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Community", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Security", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#070A12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 font-heading font-bold text-xl mb-4"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
                NexaAI
              </span>
            </Link>
            <p className="text-[#A8B0C4] text-sm mb-4 leading-relaxed">
              The complete AI platform for modern teams. Build, scale, and
              collaborate with AI.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                className="text-[#A8B0C4] hover:text-[#F2F5FF] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                className="text-[#A8B0C4] hover:text-[#F2F5FF] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-[#A8B0C4] hover:text-[#F2F5FF] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[#F2F5FF] font-semibold text-sm mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[#A8B0C4] hover:text-[#F2F5FF] text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#A8B0C4] text-sm">
            © {year} NexaAI Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
