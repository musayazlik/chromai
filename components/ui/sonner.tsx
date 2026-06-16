"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-full !border-0 !bg-[rgba(44,48,59,0.92)] !text-white !px-[18px] !py-2.5 !text-[13px] !font-medium !shadow-[0_10px_28px_rgba(0,0,0,0.25)]",
        },
      }}
      style={
        {
          "--normal-bg": "rgba(44,48,59,0.92)",
          "--normal-text": "#fff",
          "--normal-border": "transparent",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
