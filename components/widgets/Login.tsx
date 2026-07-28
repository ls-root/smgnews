import { LogIn } from "lucide-react";
import getWPRoot from "@/lib/wpRest/getWPRoot";
import Button from "../Button";
import WidgetSection from "./WidgetSection";

export default async function LoginWidget() {
  return (
    <WidgetSection title="Login" icon={LogIn}>
      <p className="mb-4 text-sm text-blue-950/70">Wenn du ein Redakteur bist, kannst du dich hier anmelden.</p>
      <Button href={await getWPRoot() + "/wp-admin"}>Login</Button>
    </WidgetSection>
  )
}
