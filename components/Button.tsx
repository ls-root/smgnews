"use client"
// Now it has no styling, but it will have in the future

import { useRouter } from "next/navigation"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string,
  children: React.ReactNode
}

export default function Button({ href, children, ...props }: ButtonProps) {
  const router = useRouter()
  const isExternal = /^https?:\/\//i.test(href)

  const handleClick = () => {
    if (isExternal) {
      window.location.href = href
      return
    }

    router.push(href)
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      className="w-fit px-2 py-1 glass rounded-full mr-2"
    >
      {children}
    </button>
  )
}
