import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';


export default function Chart({ data }: {
  data:
  {
    name: string | null,
    votes: number | null
  }[]
}) {
  return (
    <BarChart style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive data={data}>
      <XAxis dataKey="name" />
      <Tooltip />
      <Bar dataKey="votes" fill="oklch(58.8% 0.158 241.966)" />
    </BarChart>
  )
}

