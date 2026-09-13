import { CloudSun } from "lucide-react";
import { getWeather } from "@/lib/getWeather"
import { Weather } from "@/types/Weather"
import idToIcon from "@/utils/idToIcon"
import Image from "next/image"
import WidgetSection from "./WidgetSection"

export default async function WeatherWidget() {
  let weather: Weather
  try {
    const weatherFetch = await getWeather(51.278174963360236, 6.650308387510681) // Mönkesweg 58, 40670 Meerbusch, North Rhine Westphalia, Germany
    weather = weatherFetch.weather
  } catch {
    return null
  }

  const condition = weather.weather?.[0]
  if (!condition || typeof weather.main?.temp !== "number") {
    return null
  }

  const weatherIcon = idToIcon(condition.id)

  return (
    <WidgetSection title="Wetter" icon={CloudSun} bodyClassName="p-0">
      <div className="relative p-4">
        <div className="text-7xl text-blue-900 font-semibold leading-none">{Math.round(weather.main.temp)}°</div>
        <div className="mt-2 text-sm font-medium capitalize text-blue-950/70">{condition.description}</div>
        <div className="absolute bottom-0 right-0 size-32">
          <Image
            src={"/WeatherIcons/" + weatherIcon + ".svg"}
            width={128}
            height={128}
            alt={"Wetter symbol " + condition.description}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </div>
    </WidgetSection>
  )
}
