export type Weather = {
  weather: [{
    id: number,
    description: string,
    icon: string
  }],
  main: {
    temp: number,
    feels_like: number
  }
}
