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
declare module '@/components/ui/button' {
  export const Button: React.FC<any>;
  export const buttonVariants: any;
}

declare module '@/components/ui/form' {
  export const Form: React.FC<any>;
  export const FormField: React.FC<any>;
  export const FormItem: React.FC<any>;
  export const FormLabel: React.FC<any>;
  export const FormControl: React.FC<any>;
  export const FormMessage: React.FC<any>;
  export const FormDescription: React.FC<any>;
}

declare module '@/components/ui/input' {
  export const Input: React.FC<any>;
}

declare module '@/components/ui/table' {
  export const Table: React.FC<any>;
  export const TableHeader: React.FC<any>;
  export const TableBody: React.FC<any>;
  export const TableRow: React.FC<any>;
  export const TableCell: React.FC<any>;
  export const TableHead: React.FC<any>;
  export const TableFooter: React.FC<any>;
  export const TableCaption: React.FC<any>;
}

declare module '@/components/ui/avatar' {
  export const Avatar: React.FC<any>;
  export const AvatarImage: React.FC<any>;
  export const AvatarFallback: React.FC<any>;
}

declare module '@/components/ui/badge' {
  export const Badge: React.FC<any>;
}

declare module '@/components/ui/card' {
  export const Card: React.ComponentType<any>;
  export const CardContent: React.ComponentType<any>;
  export const CardHeader: React.ComponentType<any>;
  export const CardFooter: React.ComponentType<any>;
  export const CardTitle: React.FC<any>;
  export const CardDescription: React.FC<any>;
}

declare module '@/components/ui/dropdown-menu' {
  export const DropdownMenu: React.FC<any>;
  export const DropdownMenuContent: React.FC<any>;
  export const DropdownMenuItem: React.FC<any>;
  export const DropdownMenuTrigger: React.FC<any>;
  export const DropdownMenuSeparator: React.FC<any>;
  export const DropdownMenuLabel: React.FC<any>;
}



declare module '@/components/ui/select' {
  export const Select: React.FC<any>;
  export const SelectContent: React.FC<any>;
  export const SelectItem: React.FC<any>;
  export const SelectTrigger: React.FC<any>;
  export const SelectValue: React.FC<any>;
}

declare module '@/components/ui/skeleton' {
  export const Skeleton: React.ComponentType<any>;
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

declare module '@/components/ui/tooltip' {
  export const Tooltip: React.ComponentType<any>;
  export const TooltipContent: React.ComponentType<any>;
  export const TooltipProvider: React.ComponentType<any>;
  export const TooltipTrigger: React.ComponentType<any>;
}

declare module '@/components/ui/popover' {
  export const Popover: React.ComponentType<any>;
  export const PopoverContent: React.ComponentType<any>;
  export const PopoverTrigger: React.ComponentType<any>;
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

declare module '@/components/ui/tabs' {
  export const Tabs: React.ComponentType<any>;
  export const TabsContent: React.ComponentType<any>;
  export const TabsList: React.ComponentType<any>;
  export const TabsTrigger: React.ComponentType<any>;
}

export {};