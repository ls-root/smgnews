/**
 * Convert OpenWeatherMap condition codes to icon path
 * @param {number} id - OpenWeatherMap condition code (https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2)
*/
export default function idToIcon(id: number) {
  const len = String(Math.abs(id)).length
  const divisor = 10 ** (len - 1)
  const weatherCondition = Math.trunc(id / divisor)

  const mapping: Record<number, string> = {
    2: "sun",
    3: "rain",
    5: "rain",
    6: "snow",
    7: "mist",
  }

  let weatherIcon = mapping[weatherCondition]

  if (weatherCondition == 8) {
    switch (id % 10) {
      case 0: weatherIcon = "sun"; break
      case 1: weatherIcon = "few clouds"; break
      case 2: weatherIcon = "scattered clouds"; break
      case 3: weatherIcon = "broken clouds"; break
      case 4: weatherIcon = "broken clouds"; break
    }
  }

  return weatherIcon
}
