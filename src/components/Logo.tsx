import { PiggyBank } from "lucide-react";

const Logo = ({
  iconOnly = false,
  labelOnly,
}: {
  iconOnly?: boolean;
  labelOnly?: boolean;
}) => {
  return (
    <a href="/" className="flex items-center gap-2">
      {!labelOnly && (
        <PiggyBank className="stroke h-11 w-11 stroke-amber-500 stroke-[1.5]" />
      )}
      {!iconOnly && (
        <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
          Budget Tracker
        </p>
      )}
    </a>
  );
};

export default Logo;
