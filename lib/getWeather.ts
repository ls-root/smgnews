import { Weather } from "@/types/Weather";
import cache from "memory-cache";

/**
 * get weather from OpenWeatherMap
 * @param {number} latitude - latitude of location you want to get the weather from
 * @param {number} longitude - latitude of location you want to get the weather from
 */
export async function getWeather(latitude: number, longitude: number) {
  if (!process.env.OPENWEATHERMAP_API_KEY) {
    throw new Error("OPENWEATHERMAP_API_KEY is not defined");
  }

  const cachedData = cache.get("weather")
  if (cachedData) return { weather: cachedData, isCached: true }

  const params = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
    units: "metric",
    appid: process.env.OPENWEATHERMAP_API_KEY
  })

  const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params.toString()}`)
  if (!weatherResponse.ok) {
    throw new Error(`Failed to fetch weather: ${weatherResponse.status} ${weatherResponse.statusText}`)
  }

  const weather: Weather = await weatherResponse.json()
  cache.put("weather", weather, 5 * 60 * 1_000) // Cache for 5 minutes

  return { weather: weather, isCached: true }
}
