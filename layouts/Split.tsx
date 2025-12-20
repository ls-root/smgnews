export default function SplitLayout({
  Content,
  Widgets,
  Header
}: {
  Content: React.ReactNode,
  Widgets: React.ReactNode,
  Header?: React.ReactNode
}) {
  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {Header && (
        <div className="">
          {Header}
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {Content}
        </div>
        <div className="w-full lg:w-80">
          {Widgets}
        </div>
      </div>
    </div>
  )
}
