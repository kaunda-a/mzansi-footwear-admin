import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertOctagon,
  Ban,
  Bell,
  Boxes,
  Package2,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

type NotificationProps = {
  key: string;
  value: string;
  date?: string;
};

const data: NotificationProps[] = [
  // Real notifications will be populated here when integrated with notification system
];

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="relative">
          <Bell className="text-zinc-500 dark:text-zinc-400" />
          {data.length > 0 && (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground"
            >
              {data.length}
            </Badge>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/60 dark:border-zinc-700/60 shadow-xl max-w-md max-h-[80vh]">
        <DialogHeader className="p-5">
          <DialogTitle className="flex items-center gap-4">
            <Bell /> Notifications
          </DialogTitle>
        </DialogHeader>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-5">
          {data.length > 0 ? (
            data.map((item, i) => (
              <NotificationCard value={item} key={i} />
            ))
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-sm text-gray-500">
                  No notifications yet
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="border-t p-3">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setIsOpen(false)}
          >
            Clear all
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Notification;

function NotificationCard({ value }: { value: NotificationProps }) {
  const data = formatData(value);

  return (
    <>
      <div className="my-3 flex items-center gap-3">
        <span
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: `rgb(${data.color} / 0.2)`,
            color: `rgb(${data.color})`,
          }}
        >
          <data.icon />
        </span>
        <div className="space-y-0.5">
          <h1 className="text-sm font-semibold">{data.title}</h1>
          <p className="text-xs text-zinc-400">{data.description}</p>
        </div>
        <Trash2 className="ms-auto flex-shrink-0 text-danger hover:text-red-700 transition-colors duration-200" size={15} />
      </div>
      <hr />
    </>
  );
}

function formatData(data: NotificationProps) {
  if (data.key === "EGU") {
    return {
      title: "Expired Guest Users",
      description: `${data.value} expired guest users are to be removed.`,
      color: "6 182 212",
      icon: AlertOctagon,
    };
  } else if (data.key === "OP") {
    return {
      title: "Order Placed",
      description: `New Order placed by ${data.value} at ${data.date}`,
      color: "99 102 241",
      icon: Package2,
    };
  } else if (data.key === "NUR") {
    return {
      title: "New User Registration",
      description: `New user registered with email: ${data.value} at ${data.date}`,
      color: "34 197 94",
      icon: User,
    };
  } else if (data.key === "OOS") {
    return {
      title: "Out Of Stock",
      description: `Product ${data.value} have been out of stock since ${data.date}.`,
      color: "239 68 68",
      icon: Boxes,
    };
  } else {
    return {
      title: "Unknown",
      description: `Unknown`,
      color: "217 70 239",
      icon: Ban,
    };
  }
}
