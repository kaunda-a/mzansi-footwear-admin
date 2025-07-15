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
declare module '@/components/ui/avatar' {
  export const Avatar: React.ComponentType<any>;
  export const AvatarImage: React.ComponentType<any>;
  export const AvatarFallback: React.ComponentType<any>;
}

declare module '@/components/ui/button' {
  export const Button: React.ComponentType<any>;
}

declare module '@/components/ui/table' {
  export const Table: React.ComponentType<any>;
  export const TableHeader: React.ComponentType<any>;
  export const TableBody: React.ComponentType<any>;
  export const TableRow: React.ComponentType<any>;
  export const TableCell: React.ComponentType<any>;
  export const TableHead: React.ComponentType<any>;
}

declare module '@/components/ui/badge' {
  export const Badge: React.ComponentType<any>;
}

declare module '@/components/ui/form' {
  export const Form: React.ComponentType<any>;
  export const FormField: React.ComponentType<any>;
  export const FormItem: React.ComponentType<any>;
  export const FormLabel: React.ComponentType<any>;
  export const FormControl: React.ComponentType<any>;
  export const FormMessage: React.ComponentType<any>;
}

declare module '@/components/ui/input' {
  export const Input: React.ComponentType<any>;
}

declare module '@/components/ui/select' {
  export const Select: React.ComponentType<any>;
  export const SelectContent: React.ComponentType<any>;
  export const SelectItem: React.ComponentType<any>;
  export const SelectTrigger: React.ComponentType<any>;
  export const SelectValue: React.ComponentType<any>;
}

declare module '@/components/ui/dropdown-menu' {
  export const DropdownMenu: React.ComponentType<any>;
  export const DropdownMenuContent: React.ComponentType<any>;
  export const DropdownMenuItem: React.ComponentType<any>;
  export const DropdownMenuTrigger: React.ComponentType<any>;
}

declare module '@/components/ui/pagination' {
  export const Pagination: React.ComponentType<any>;
  export const PaginationContent: React.ComponentType<any>;
  export const PaginationItem: React.ComponentType<any>;
  export const PaginationLink: React.ComponentType<any>;
  export const PaginationNext: React.ComponentType<any>;
  export const PaginationPrevious: React.ComponentType<any>;
}

declare module '@/components/ui/tabs' {
  export const Tabs: React.ComponentType<any>;
  export const TabsContent: React.ComponentType<any>;
  export const TabsList: React.ComponentType<any>;
  export const TabsTrigger: React.ComponentType<any>;
}

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
