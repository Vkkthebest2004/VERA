import { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  onClick,
}: {
  name: string;
  className?: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href?: string;
  cta: string;
  onClick?: () => void;
}) => (
  <div
    key={name}
    onClick={onClick}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer",
      // light styles
      "bg-white border border-neutral-200/90 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-5 transition-all duration-300 group-hover:-translate-y-8">
      <Icon className="h-10 w-10 origin-left transform-gpu text-neutral-800 transition-all duration-300 ease-in-out group-hover:scale-75 dark:text-neutral-200" />
      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {name}
      </h3>
      <p className="max-w-lg text-xs text-neutral-500 leading-relaxed dark:text-neutral-400">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-8 transform-gpu flex-row items-center p-3.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button
        variant="ghost"
        asChild={!onClick && !!href}
        size="sm"
        onClick={onClick}
        className="pointer-events-auto text-xs font-semibold text-neutral-900 hover:text-black dark:text-neutral-100"
      >
        {onClick ? (
          <span className="flex items-center">
            {cta}
            <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
          </span>
        ) : (
          <a href={href || "#"}>
            {cta}
            <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
          </a>
        )}
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
