"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Shield,
  Globe,
  HelpCircle,
  MessageCircle,
  FileText,
  Lock,
  LogOut,
} from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const accountSettings = [
    { icon: User, label: "Personal information", href: "/profile/personal" },
    { icon: Bell, label: "Notifications", href: "/profile/notifications" },
    { icon: Shield, label: "Security", href: "/profile/security" },
    { icon: Globe, label: "Language", href: "/profile/language", value: "English" },
  ]

  const supportOptions = [
    { icon: HelpCircle, label: "Help center", href: "/support/help" },
    { icon: MessageCircle, label: "Contact us", href: "/support/contact" },
    { icon: FileText, label: "Terms of service", href: "/support/terms" },
    { icon: Lock, label: "Privacy policy", href: "/support/privacy" },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen rosca-bg text-white pb-20">
        <div className="max-w-sm mx-auto p-6">
          <div className="flex items-center mb-8">
            <Link href="/dashboard">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-semibold ml-4">Profile & Settings</h1>
          </div>

          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24 border-4 border-[#7ED321]">
                  <AvatarImage src="/images/profile-avatar.png" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#7ED321] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-black" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.user_metadata?.full_name || "User"}</h2>
                <p className="text-gray-400">Joined 2 years ago</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold rosca-green-text mb-4 uppercase tracking-wider">Account</h3>
              <div className="space-y-1">
                {accountSettings.map((setting, index) => (
                  <Link key={index} href={setting.href}>
                    <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors">
                      <div className="flex items-center space-x-3">
                        <setting.icon className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{setting.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {setting.value && <span className="text-gray-400 text-sm">{setting.value}</span>}
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold rosca-green-text mb-4 uppercase tracking-wider">Support</h3>
              <div className="space-y-1">
                {supportOptions.map((option, index) => (
                  <Link key={index} href={option.href}>
                    <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors">
                      <div className="flex items-center space-x-3">
                        <option.icon className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={async () => {
                  await signOut()
                  router.push("/")
                }}
                className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>

        <BottomNavigation currentPage="profile" />
      </div>
    </ProtectedRoute>
  )
}
