"use client";

import { useMemo } from "react";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";

import SkeletonWrapper from "@/components/SkeletonWrapper";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helper";
import { TransactionType } from "@/lib/type";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

const CategoriesStats = ({ userSettings, from, to }: Props) => {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};

export default CategoriesStats;

const CategoriesCard = ({
  data,
  type,
  formatter,
}: {
  data: GetCategoriesStatsResponseType;
  type: TransactionType;
  formatter: Intl.NumberFormat;
}) => {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );

  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-gray-600 md:grid-flow-col">
          {type.charAt(0).toUpperCase() + type.slice(1)}s by category
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            No data for the selected period
            <p className="text-sm text-muted-foreground">
              Try selecting a different period or try adding new {type}s
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const persentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600 gap-2">
                        <span>{item.categoryIcon}</span>
                        <span>
                          <span className="font-semibold">{item.category}</span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({persentage.toFixed(0)}%)
                          </span>
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={persentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-rose-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};
