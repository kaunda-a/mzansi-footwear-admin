"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const VisitOptions = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 me-3"
        >
          <MoreVertical size={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Today</DropdownMenuItem>
        <DropdownMenuItem>Last week</DropdownMenuItem>
        <DropdownMenuItem>Last month</DropdownMenuItem>
        <DropdownMenuItem>All Time</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VisitOptions;
