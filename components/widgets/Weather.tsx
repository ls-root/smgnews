import { getWeather } from "@/lib/getWeather"
import { Weather } from "@/types/Weather"
import idToIcon from "@/utils/idToIcon"
import Image from "next/image"

export default async function WeatherWidget() {
  const weatherFetch = await getWeather(51.278174963360236, 6.650308387510681) // Mönkesweg 58, 40670 Meerbusch, North Rhine Westphalia, Germany
  const weather: Weather = weatherFetch.weather
  const weatherIcon = idToIcon(weather.weather[0].id)

  return (
    <>
      <h1>{weather.main.temp}</h1>
      <Image
        src={"/WeatherIcons/" + weatherIcon + ".svg"}
        width={100}
        height={100}
        alt={"Wetter symbol " + weather.weather[0].description}
      />
    </>
  )
}
