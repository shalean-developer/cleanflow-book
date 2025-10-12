import React from "react";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const SectionCard = ({ title, icon: Icon, children }: SectionCardProps) => {
  return (
    <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#EAF2FF] dark:bg-[#0C53ED]/20">
          <Icon className="w-5 h-5 text-[#0C53ED]" />
        </div>
        <h2 className="text-xl font-semibold text-[#180D39] dark:text-white/90">
          {title}
        </h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

