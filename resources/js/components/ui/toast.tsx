import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for classnames

type ToastVariant = "default" | "success" | "error";

const variantIcons = {
  success: CheckCircle2,
  error: XCircle,
  default: Info,
};

const variantStyles: Record<ToastVariant, string> = {
  default: "bg-white border-blue-100 text-blue-800",
  success: "bg-white border-green-100 text-green-800",
  error: "bg-white border-red-100 text-red-800",
};

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  duration?: number;
  variant?: ToastVariant;
  className?: string;
}

export const Toast = React.forwardRef<HTMLLIElement, ToastProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      duration = 3000,
      variant = "default",
      className,
    },
    ref
  ) => {
    const Icon = variantIcons[variant];

    return (
      <ToastPrimitive.Provider swipeDirection="right" duration={duration}>
        <ToastPrimitive.Root
          ref={ref}
          open={open}
          onOpenChange={onOpenChange}
          className={cn(
            "fixed right-4 top-4 z-[100] w-full max-w-2xl rounded-lg border shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-90",
            "data-[state=open]:slide-in-from-top-full data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
            variantStyles[variant],
            className
          )}
        >
          <div className="flex items-start gap-3 p-4">
            <Icon className={`h-5 w-5 flex-shrink-0 ${
              variant === "success" ? "text-green-500" :
              variant === "error" ? "text-red-500" :
              "text-blue-500"
            }`} />

            <div className="flex-1 space-y-1">
              <ToastPrimitive.Title className="text-sm font-medium">
                {title}
              </ToastPrimitive.Title>
              {description && (
                <ToastPrimitive.Description className="text-sm text-muted-foreground">
                  {description}
                </ToastPrimitive.Description>
              )}
            </div>

            <ToastPrimitive.Close
              aria-label="Close"
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </ToastPrimitive.Close>
          </div>
        </ToastPrimitive.Root>

        <ToastPrimitive.Viewport className="fixed right-0 top-0 z-[100] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2 p-4 outline-none" />
      </ToastPrimitive.Provider>
    );
  }
);

Toast.displayName = ToastPrimitive.Root.displayName;
