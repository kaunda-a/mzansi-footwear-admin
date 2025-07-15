// React 19 compatibility fix for shadcn/ui components
declare module '@/components/ui/*' {
  const component: React.ComponentType<any>;
  export default component;
}

// React Hook Form field type helper
import type { ControllerRenderProps, FieldValues, FieldPath } from 'react-hook-form';

export type FormFieldRenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
};

// Global type augmentation for React 19 forwardRef components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Specific component type overrides
// Avatar components are properly typed in their source file

// Button component is properly typed in its source file

// Table components are properly typed in their source file

// Badge component is properly typed in its source file

// Form components are properly typed in their source file

// Input component is properly typed in its source file

// Select components are properly typed in their source file

// DropdownMenu, Pagination, and Tabs components are properly typed in their source files

declare module '@/components/ui/card' {
  export const Card: React.ComponentType<any>;
  export const CardContent: React.ComponentType<any>;
  export const CardHeader: React.ComponentType<any>;
  export const CardFooter: React.ComponentType<any>;
}

declare module '@/components/ui/popover' {
  export const Popover: React.ComponentType<any>;
  export const PopoverContent: React.ComponentType<any>;
  export const PopoverTrigger: React.ComponentType<any>;
}

declare module '@/components/ui/skeleton' {
  export const Skeleton: React.ComponentType<any>;
}

declare module '@/components/ui/radio-group' {
  export const RadioGroup: React.ComponentType<any>;
  export const RadioGroupItem: React.ComponentType<any>;
}

declare module '@/components/ui/label' {
  export const Label: React.ComponentType<any>;
}

declare module '@/components/ui/textarea' {
  export const Textarea: React.ComponentType<any>;
}

declare module '@/components/ui/dialog' {
  export const Dialog: React.ComponentType<any>;
  export const DialogContent: React.ComponentType<any>;
  export const DialogHeader: React.ComponentType<any>;
  export const DialogTitle: React.ComponentType<any>;
  export const DialogTrigger: React.ComponentType<any>;
  export const DialogDescription: React.ComponentType<any>;
  export const DialogFooter: React.ComponentType<any>;
}

declare module '@/components/ui/popover' {
  export const Popover: React.ComponentType<any>;
  export const PopoverContent: React.ComponentType<any>;
  export const PopoverTrigger: React.ComponentType<any>;
}

declare module '@/components/ui/tooltip' {
  export const Tooltip: React.ComponentType<any>;
  export const TooltipContent: React.ComponentType<any>;
  export const TooltipProvider: React.ComponentType<any>;
  export const TooltipTrigger: React.ComponentType<any>;
}

declare module '@/components/ui/tabs' {
  export const Tabs: React.ComponentType<any>;
  export const TabsContent: React.ComponentType<any>;
  export const TabsList: React.ComponentType<any>;
  export const TabsTrigger: React.ComponentType<any>;
}

export {};
