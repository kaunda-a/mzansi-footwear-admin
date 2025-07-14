// Standardized form styling configuration for consistent UI across the app

export const standardInputStyles = {
  size: "lg" as const,
  variant: "bordered" as const,
  radius: "lg" as const,
  labelPlacement: "outside" as const,
  classNames: {
    label: "text-sm font-medium text-slate-700 dark:text-zinc-300 z-0",
    input: "text-base placeholder:text-slate-400 dark:placeholder:text-zinc-500",
    inputWrapper: [
      "border-2",
      "border-slate-200/60",
      "bg-white/50",
      "dark:bg-zinc-900/50",
      "dark:border-zinc-700/40",
      "group-data-[focus=true]:border-emerald-500/60",
      "dark:group-data-[focus=true]:border-emerald-400/60",
      "group-data-[hover=true]:border-slate-300",
      "dark:group-data-[hover=true]:border-zinc-600",
      "shadow-sm",
      "hover:shadow-md",
      "transition-all",
      "duration-200",
      "min-h-[3.5rem]", // Ensures proper height
    ],
  },
};

export const standardTextareaStyles = {
  size: "lg" as const,
  variant: "bordered" as const,
  radius: "lg" as const,
  labelPlacement: "outside" as const,
  minRows: 4,
  classNames: {
    label: "text-sm font-medium text-slate-700 dark:text-zinc-300 z-0",
    input: "text-base placeholder:text-slate-400 dark:placeholder:text-zinc-500",
    inputWrapper: [
      "border-2",
      "border-slate-200/60",
      "bg-white/50",
      "dark:bg-zinc-900/50",
      "dark:border-zinc-700/40",
      "group-data-[focus=true]:border-emerald-500/60",
      "dark:group-data-[focus=true]:border-emerald-400/60",
      "group-data-[hover=true]:border-slate-300",
      "dark:group-data-[hover=true]:border-zinc-600",
      "shadow-sm",
      "hover:shadow-md",
      "transition-all",
      "duration-200",
      "min-h-[6rem]", // Larger minimum height for textareas
    ],
  },
};

export const standardSelectStyles = {
  size: "lg" as const,
  variant: "bordered" as const,
  radius: "lg" as const,
  labelPlacement: "outside" as const,
  classNames: {
    label: "text-sm font-medium text-slate-700 dark:text-zinc-300 z-0",
    trigger: [
      "border-2",
      "border-slate-200/60",
      "bg-white/50",
      "dark:bg-zinc-900/50",
      "dark:border-zinc-700/40",
      "data-[focus=true]:border-emerald-500/60",
      "dark:data-[focus=true]:border-emerald-400/60",
      "data-[hover=true]:border-slate-300",
      "dark:data-[hover=true]:border-zinc-600",
      "shadow-sm",
      "hover:shadow-md",
      "transition-all",
      "duration-200",
      "min-h-[3.5rem]",
    ],
    value: "text-base text-slate-700 dark:text-zinc-300",
  },
};

// Compact styles for smaller forms or dialogs where space is limited
export const compactInputStyles = {
  ...standardInputStyles,
  size: "md" as const,
  classNames: {
    ...standardInputStyles.classNames,
    inputWrapper: [
      ...standardInputStyles.classNames.inputWrapper.filter(
        (cls) => cls !== "min-h-[3.5rem]"
      ),
      "min-h-[3rem]",
    ],
  },
};

export const compactTextareaStyles = {
  ...standardTextareaStyles,
  size: "md" as const,
  minRows: 3,
  classNames: {
    ...standardTextareaStyles.classNames,
    inputWrapper: [
      ...standardTextareaStyles.classNames.inputWrapper.filter(
        (cls) => cls !== "min-h-[6rem]"
      ),
      "min-h-[4.5rem]",
    ],
  },
};

// Form item spacing
export const formItemSpacing = "mb-4";
export const compactFormItemSpacing = "mb-3";
