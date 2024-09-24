"use client";

import { usePathname } from "next/navigation";

import Logo from "./Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import ThemeToggle from "./theme/ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

const items = [
  { label: "Dashboard", link: "/" },
  { label: "Transaction", link: "/transaction" },
  { label: "Manage", link: "//manage" },
];

const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
};

export default Navbar;

const DesktopNavbar = () => {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {items.map(({ label, link }) => (
              <NavbarItem key={label} label={label} link={link} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </nav>
    </div>
  );
};

const MobileNavbar = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="block border-b border-separate bg-background md:hidden">
      <nav className="container mx-auto flex items-center justify-center gap-2 px-4">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[375px] sm:w-[540px]" side="left">
            <Logo labelOnly />
            <div className="flex flex-col gap-1 pt-4">
              {items.map(({ label, link }) => (
                <NavbarItem
                  key={label}
                  label={label}
                  link={link}
                  onClick={() => setOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4 me-auto">
          <Logo iconOnly />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </nav>
    </div>
  );
};

const NavbarItem = ({
  label,
  link,
  onClick,
}: {
  label: string;
  link: string;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute bottom-0 left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
      )}
    </div>
  );
};
