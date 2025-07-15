// Standardized form styling configuration using Tailwind CSS design system with RGB colors

export const standardInputClasses = "flex h-12 w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors";

export const standardTextareaClasses = "flex min-h-[120px] w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors";

export const standardLabelClasses = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground mb-2 block";

export const standardSelectClasses = "flex h-12 w-full items-center justify-between rounded-lg border-2 border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-colors";

export const standardButtonClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 px-6 py-3";

export const primaryButtonClasses = "bg-primary text-primary-foreground hover:bg-primary/90";

export const secondaryButtonClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/80";

export const destructiveButtonClasses = "bg-destructive text-destructive-foreground hover:bg-destructive/90";

export const outlineButtonClasses = "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground";

// Form item spacing
export const formItemSpacing = "space-y-2 mb-6";
export const compactFormItemSpacing = "space-y-1 mb-4";

// Form container classes
export const formContainerClasses = "space-y-6";
export const formSectionClasses = "space-y-4";

// Error message classes
export const errorMessageClasses = "text-sm font-medium text-destructive mt-1";

// Helper text classes
export const helperTextClasses = "text-sm text-muted-foreground mt-1";
