import getWPRoot from "@/lib/wpRest/getWPRoot";
import Button from "../Button";

export default async function LoginWidget() {
  console.log(await getWPRoot())
  return (
    <div className="relative glass rounded-3xl p-4">
      <h3>Login</h3>
      <p>Wenn du ein Redakteure bist kannst du dich hier anmelden.</p>
      <Button href={await getWPRoot() + "/wp-login"}>Login</Button>
    </div>
  )
}
