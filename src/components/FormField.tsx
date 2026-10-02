import type { InputHTMLAttributes, ReactNode } from "react";

export const inputClasses =
  "w-full rounded-lg border border-border-opaque bg-background-primary px-4 py-[13px] font-['Rubik'] text-[length:var(--fontsize-body-m)] leading-5 text-content-primary outline-none transition-shadow placeholder:text-content-tertiary focus:ring-2 focus:ring-brand-red";

export const labelClasses =
  "font-['Rubik'] text-[length:var(--fontsize-label-m)] leading-4 font-medium text-content-primary";

export function LabelText({
  label,
  note,
  required,
}: {
  label: string;
  note?: string;
  required?: boolean;
}) {
  return (
    <span className={labelClasses}>
      {label}
      {note && <span className="font-normal text-content-tertiary"> {note}</span>}
      {required && <span className="text-brand-red">*</span>}
    </span>
  );
}

export function Field({
  label,
  note,
  required,
  children,
}: {
  label: string;
  note?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-2">
      <LabelText label={label} note={note} required={required} />
      {children}
    </label>
  );
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  note?: string;
};

export function TextField({ label, note, required, type = "text", ...inputProps }: TextFieldProps) {
  return (
    <Field label={label} note={note} required={required}>
      <input type={type} required={required} className={inputClasses} {...inputProps} />
    </Field>
  );
}
