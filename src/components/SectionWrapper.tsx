import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  noPadding?: boolean;
}

export function SectionWrapper({ children, className, id, noPadding = false }: SectionWrapperProps) {
  return (
    <section 
      id={id} 
      className={cn(
        "relative w-full",
        !noPadding && "py-24 sm:py-32",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
        {children}
      </div>
    </section>
  );
}
