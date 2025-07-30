import { cn } from "@/lib/utils"; // if using className helpers
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn("bg-blue-600 rounded-lg p-3", className)}
      {...props}
    >
      <Text className="text-white font-semibold text-center">{children}</Text>
    </TouchableOpacity>
  );
}
