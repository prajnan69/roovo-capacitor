import { cn } from "@/lib/utils";

export const Shimmer = ({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <div
      className={cn(
        "animate-shimmer bg-[linear-gradient(110deg,#000103,45%,#1e293b,55%,#000103)] bg-[length:200%_100%]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
