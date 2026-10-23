"use client";

import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-950 group-[.toaster]:text-zinc-100 group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl text-xs",
          description: "group-[.toast]:text-zinc-400 text-[11px]",
          actionButton:
            "group-[.toast]:bg-indigo-600 group-[.toast]:text-white font-semibold text-xs",
          cancelButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-300 font-semibold text-xs",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
