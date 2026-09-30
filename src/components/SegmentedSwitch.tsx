type SegmentedSwitchProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

export default function SegmentedSwitch<T extends string>({
  options,
  value,
  onChange,
  label,
  className = "",
}: SegmentedSwitchProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex items-center rounded-full bg-black/12 p-1 shadow-[0_1px_4px_rgba(12,12,13,0.1),0_1px_4px_rgba(12,12,13,0.05)] ${className}`}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-full px-[10px] py-2 leading-[normal] md:px-3 md:py-[9px] font-['Rubik'] text-[length:var(--fontsize-label-m)] font-semibold whitespace-nowrap transition-[background-color,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-grey lg:px-4 lg:py-[10px] lg:text-[length:var(--fontsize-label-l)] ${
              active
                ? "bg-background-primary text-brand-grey"
                : "bg-transparent text-content-primary/30 hover:text-content-primary/60"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
