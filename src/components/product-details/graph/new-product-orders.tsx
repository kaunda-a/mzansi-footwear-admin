"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductOrdersGraph from "./product-orders-graph";
import { Dispatch, SetStateAction, useState } from "react";

type FilterButtonProps = {
  children: string;
  data: any[];
  filter: string;
  activeFilter: string;
  setGraphData: Dispatch<SetStateAction<any[]>>;
  setActiveFilter: Dispatch<SetStateAction<string>>;
};

const NewProductOrders = ({
  data,
}: {
  data: { weeklyData: any[]; monthlyData: any[]; yearlyData: any[] };
}) => {
  const [graphData, setGraphData] = useState(data.yearlyData);
  const [activeFilter, setActiveFilter] = useState("year");
  return (
    <Card className="col-span-2 shadow-md">
      <CardContent className="p-6">
        <div className="mb-10 grid grid-cols-1 items-center space-y-2 @sm:grid-cols-2">
          <h1 className="mx-2 mt-2 text-lg font-medium">Product Orders</h1>
          <div className="@sm:justify-self-end">
            <FilterButton
              data={data.weeklyData}
              filter="week"
              activeFilter={activeFilter}
              setGraphData={setGraphData}
              setActiveFilter={setActiveFilter}
            >
              Week
            </FilterButton>
            <FilterButton
              data={data.monthlyData}
              filter="month"
              activeFilter={activeFilter}
              setGraphData={setGraphData}
              setActiveFilter={setActiveFilter}
            >
              Month
            </FilterButton>
            <FilterButton
              data={data.yearlyData}
              filter="year"
              activeFilter={activeFilter}
              setGraphData={setGraphData}
              setActiveFilter={setActiveFilter}
            >
              Year
            </FilterButton>
          </div>
        </div>
        <ProductOrdersGraph data={graphData} />
      </CardContent>
    </Card>
  );
};

export default NewProductOrders;

const FilterButton = ({
  children,
  data,
  filter,
  activeFilter,
  setGraphData,
  setActiveFilter,
}: FilterButtonProps) => (
  <Button
    size="sm"
    onClick={() => {
      setGraphData(data);
      setActiveFilter(filter);
    }}
    variant={activeFilter === filter ? "default" : "ghost"}
    className={`
      mx-1 ${
        activeFilter === filter
          ? "bg-primary text-white hover:bg-primary/90"
          : "bg-transparent text-black hover:bg-indigo-100 hover:text-primary dark:text-white dark:hover:bg-zinc-800"
      }
    `}
  >
    {children}
  </Button>
);
