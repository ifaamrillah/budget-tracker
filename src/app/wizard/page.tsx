import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/Logo";
import CurrencyCombobox from "@/components/CurrencyCombobox";

export default async function page() {
  const user = await currentUser();
  if (!user) redirect("sign-in");

  return (
    <div className="container mx-auto flex max-w-2xl flex-col items-center justify-between gap-4 px-4 md:px-0">
      <div>
        <Logo />
      </div>
      <div className="mt-4">
        <h1 className="text-center text-3xl">
          Welcome, <span className="ml-2 font-bold">{user.firstName} 👋</span>
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Let&apos;s get started by setting up your currency
        </h2>
        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          You can change these settings at any time
        </h3>
      </div>
      <Separator className="my-2" />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyCombobox />
        </CardContent>
      </Card>
      <Separator className="my-2" />
      <Button className="w-full" asChild>
        <Link href="/">I&apos;m done! Take me to the dashboard.</Link>
      </Button>
    </div>
  );
}
