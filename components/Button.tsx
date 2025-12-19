"use client"
// Now it has no styling, but it will have in the future

import { useRouter } from "next/navigation"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string,
  children: React.ReactNode
}

export default function Button({ href, children, ...props }: ButtonProps) {
  const router = useRouter()

  return (
    <button
      {...props}
      onClick={() => router.push(href)}
      style={{ cursor: "pointer" }}
      className="w-fit px-2 py-1 glass"
    >
      {children}
    </button>
  )
}
