import { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">{children}</div>
    </div>
  )
}
