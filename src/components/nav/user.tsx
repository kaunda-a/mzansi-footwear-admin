import { authOptions } from "@/lib/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Settings, LogOut } from "lucide-react";
import { Session, getServerSession } from "next-auth";
import Link from "next/link";

const User = async () => {
  const session = await getServerSession(authOptions);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full bg-muted/50 hover:bg-muted py-1 ps-1 sm:pe-4 md:py-1 md:ps-1 h-auto gap-1 sm:gap-2"
        >
          <Avatar className="w-8 h-8 md:w-10 md:h-10">
            <AvatarImage src={session?.user.image || "/avatar.jpg"} alt={session?.user.name || "User"} />
            <AvatarFallback>
              {session?.user.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-xs lg:text-sm font-medium">{session?.user.name}</span>
            <span className="text-green-600 dark:text-green-400 font-medium text-[0.5rem] md:text-xs">
              {session?.user.role}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <UserCard session={session} />
      </PopoverContent>
    </Popover>
  );
};

export default User;

const UserCard = ({ session }: { session: Session | null }) => {
  return (
    <Card className="border-0 shadow-lg min-w-[250px] max-w-[300px]">
      <CardHeader className="pb-3">
        <div className="flex gap-3 items-center">
          <Avatar className="w-12 h-12 border-2 border-border">
            <AvatarImage src={session?.user.image || "/avatar.jpg"} alt={session?.user.name || "User"} />
            <AvatarFallback>
              {session?.user.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <h4 className="text-sm font-semibold leading-none">
              {session?.user.name}
            </h4>
            <h5 className="text-xs font-medium tracking-tight text-green-600 dark:text-green-400">
              {session?.user.role}
            </h5>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-0">
        <p className="text-sm text-muted-foreground">
          Welcome back {session?.user.name}
          <span aria-label="confetti" role="img" className="ml-1">
            🎉
          </span>
        </p>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full justify-start h-9"
        >
          <Link href="/dashboard/settings">
            <Settings size={15} className="mr-2" />
            Settings
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full justify-start h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Link href="/signout">
            <LogOut size={15} className="mr-2" />
            Sign Out
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
