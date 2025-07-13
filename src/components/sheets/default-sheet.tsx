import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {} from "lucide-react";
import { ReactNode } from "react";

type DefaultSheetProps = {
  trigger: ReactNode;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  classNames?: {
    footer?: string;
    content?: string;
    title?: string;
    header?: string;
  };
};

const DefaultSheet = (props: DefaultSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{props.trigger}</SheetTrigger>
      <SheetContent
        className={cn(
          "flex flex-col gap-0 p-0 outline-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-teal1/60 shadow-xl rounded-2xl",
          props.classNames?.content,
        )}
      >
        <SheetHeader className={cn("p-5", props.classNames?.header)}>
          <SheetTitle className={props.classNames?.title}>
            {props.title}
          </SheetTitle>
        </SheetHeader>
        {props.children}
        <SheetFooter className={cn(props.classNames?.footer)}>
          {props.footer}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default DefaultSheet;
