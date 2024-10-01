"use client";

import { DateToUTCDate } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";

interface Props {
  from: Date;
  to: Date;
}

const TransactionTable = ({ from, to }: Props) => {
  const history = useQuery({
    queryKey: ["transactions", "history", from, to],
    queryFn: () =>
      fetch(
        `/api/transactions-history?from=${DateToUTCDate(
          from
        )}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  console.log(history);

  return <div>TransactionTable</div>;
};

export default TransactionTable;
