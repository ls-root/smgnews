import { getWeather } from "@/lib/getWeather"
import { Weather } from "@/types/Weather"
import idToIcon from "@/utils/idToIcon"
import Image from "next/image"

export default async function WeatherWidget() {
  const weatherFetch = await getWeather(51.278174963360236, 6.650308387510681) // Mönkesweg 58, 40670 Meerbusch, North Rhine Westphalia, Germany
  const weather: Weather = weatherFetch.weather
  const weatherIcon = idToIcon(weather.weather[0].id)

  return (
    <div className="glass rounded-3xl">

      <div className="p-6 relative h-60 w-full">
        <div className="text-2xl text-blue-950 font-bold">Wetter</div>
        <div className="text-7xl text-blue-900 mt-2 font-semibold">{weather.main.temp}°C</div>
        <div className="absolute bottom-0 right-0 w-44">
          <Image
            src={"/WeatherIcons/" + weatherIcon + ".svg"}
            width={100}
            height={100}
            alt={"Wetter symbol " + weather.weather[0].description}
            className="w-full h-full object-cover rounded-br-3xl"
          />
        </div>
      </div>
    </div>
  )
}
