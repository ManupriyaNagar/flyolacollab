import { cn } from "@/lib/utils";
import Link from "next/link";
/**
 * Reusable sidebar menu item component
 */
export const SidebarMenuItem = ({ 
  href, 
  icon: Icon, 
  label, 
  isActive, 
  iconColor = "text-blue-400",
  activeGradient = "from-blue-600 to-indigo-600"
}) => {
  const active = isActive(href);
  
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
        active 
          ? `bg-gradient-to-r ${activeGradient} text-white shadow-lg` 
          : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
      }`}
    >
      <Icon className={`text-lg ${active ? "text-white" : iconColor}`} />
      <span className="font-medium">{label}</span>
      {active && (
        <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
      )}
    </Link>
  );
};

/**
 * Reusable sidebar section component
 */
export const SidebarSection = ({ title, children }) => {
  return (
    <div className="mb-6">
      <p className={cn('text-xs', 'font-semibold', 'text-slate-400', 'uppercase', 'tracking-wider', 'mb-3', 'px-3')}>
        {title}
      </p>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};
