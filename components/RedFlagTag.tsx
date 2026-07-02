import { AlertTriangle } from "lucide-react";
import Badge from "./ui/Badge";

export default function RedFlagTag({ count }: { count: number }) {
  return (
    <Badge variant="weak" icon={AlertTriangle}>
      {count} red flag{count === 1 ? "" : "s"}
    </Badge>
  );
}
