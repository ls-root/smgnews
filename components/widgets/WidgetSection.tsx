import { cn } from "@/lib/cn"
import { LucideIcon } from "lucide-react"

export default function WidgetSection({
  title,
  icon: Icon,
  children,
  className,
  bodyClassName
}: {
  title: string,
  icon?: LucideIcon,
  children: React.ReactNode,
  className?: string,
  bodyClassName?: string
}) {
  return (
    <section className={cn("glass rounded-3xl overflow-hidden shadow-sm", className)}>
      <header className="flex items-center gap-2 px-4 py-3 border-b-2 border-blue-300/40 bg-blue-200/30">
        {Icon && <Icon className="size-6 text-accent shrink-0" strokeWidth={2.5} />}
        <h3 className="text-base font-bold text-blue-950 tracking-tight">{title}</h3>
      </header>
      <div className={cn("p-4", bodyClassName)}>
        {children}
      </div>
    </section>
  )
}
