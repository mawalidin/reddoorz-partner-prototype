import type { ReactNode, Ref } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

export default function Container({ children, className = "", ref }: ContainerProps) {
  return (
    <div ref={ref} className={`mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-20 ${className}`}>
      {children}
    </div>
  );
}
