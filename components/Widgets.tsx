import { getRandomPoll } from "@/lib/drizzle/getRandomPoll";
import PollWidget from "./widgets/Poll";
import WeatherWidget from "./widgets/Weather";

export default async function Widgets() {
  const poll = await getRandomPoll()

  return (
    <>
      <PollWidget poll={poll} />
      <WeatherWidget />
    </>
  )
}
