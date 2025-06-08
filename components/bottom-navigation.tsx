import Link from "next/link"
import { Home, RefreshCw, CreditCard, User } from "lucide-react"

interface BottomNavigationProps {
  currentPage: "home" | "cycles" | "payments" | "profile"
}

export function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const navItems = [
    { icon: Home, label: "Home", href: "/dashboard", key: "home" },
    { icon: RefreshCw, label: "Cycles", href: "/cycles", key: "cycles" },
    { icon: CreditCard, label: "Payments", href: "/payments", key: "payments" },
    { icon: User, label: "Profile", href: "/profile", key: "profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2D4A3A] border-t border-gray-700">
      <div className="max-w-sm mx-auto px-6 py-3">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = currentPage === item.key
            return (
              <Link key={item.key} href={item.href}>
                <div
                  className={`flex flex-col items-center space-y-1 p-2 rounded-2xl ${
                    isActive ? "bg-[#7ED321] text-black" : "text-gray-400"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
