import TransactionList from "./_components/TransactionList";

export default function page() {
  return (
    <div className="h-full bg-background px-4 md:px-0 pb-16">
      <div className="border-b bg-card">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 py-8 px-4 md:px-0">
          <div>
            <p className="text-3xl font-bold">Transactions</p>
            <p className="text-muted-foreground">Track your transactions</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col gap-4 py-8">
        <TransactionList />
      </div>
    </div>
  );
}
