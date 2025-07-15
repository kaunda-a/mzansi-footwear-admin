import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { SummaryCardProps } from "@/lib/types/types";
import CountUpValue from "@/components/countup-value";

function SummaryCard(props: SummaryCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="flex flex-row gap-3 p-6">
        <Button
          size="icon"
          className={`mt-1 rounded-full ${props.bgcolor} border border-border/60 hover:scale-105 transition-transform`}
        >
          <props.icon className={`h-5 w-5 ${props.color}`} />
        </Button>
        <div className="w-full">
          <span className="text-xs capitalize text-muted-foreground font-medium">
            {props.title}
          </span>
          {props.isLoading ? (
            <Skeleton className="mt-1 w-3/5 h-8 rounded-lg" />
          ) : (
            <h3 className="text-2xl font-semibold mt-1">
              <CountUpValue
                value={Number(props.value)}
                isCurrency={props.isCurrency}
              />
            </h3>
          )}
          <div className="mt-3 flex items-center justify-between">
            {props.url && (
              <Button
                variant="link"
                size="sm"
                asChild
                className={`p-0 h-auto ${props.color} hover:underline`}
              >
                <Link href={props.url}>
                  View all <MoveRight size={15} className="ml-1" />
                </Link>
              </Button>
            )}
            {props.percentage && (
              <div className="ms-auto flex flex-col text-right">
                <span
                  className={`${
                    props.percentage.increased ? "text-success" : "text-danger"
                  } block font-medium`}
                >
                  {props.percentage.increased ? "+" : "-"}{" "}
                  {props.percentage.value} %
                </span>
                <span className="text-xs text-muted-foreground">
                  this month
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SummaryCard;
