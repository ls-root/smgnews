import { getRandomPoll } from "@/lib/drizzle/getRandomPoll";
import PollWidget from "./widgets/Poll";
import WeatherWidget from "./widgets/Weather";
import SearchWidget from "./widgets/Search";
import LoginWidget from "./widgets/Login";

export default async function Widgets() {
  const poll = await getRandomPoll()

  return (
    <div className="space-y-4">
      <SearchWidget />
      <PollWidget poll={poll} />
      <WeatherWidget />
      <LoginWidget />
    </div>
  )
}
