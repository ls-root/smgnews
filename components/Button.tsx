"use client"
// Now it has no styling, but it will have in the future

import { useRouter } from "next/navigation"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string,
  href: string
}

export default function Button({ text, href, ...props }: ButtonProps) {
  const router = useRouter()

  return (
    <button
      {...props}
      onClick={() => router.push(href)}
      style={{ cursor: "pointer" }}
      className="ring-1 ring-black w-fit"
    >
      {text}
    </button>
  )
}
