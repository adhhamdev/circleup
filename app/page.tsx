import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  return (
    <div className="min-h-screen rosca-bg flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <div className="w-80 h-80 rounded-3xl overflow-hidden bg-[#F5E6D3]">
            <Image
              src="/images/welcome-illustration.png"
              alt="Welcome illustration"
              width={320}
              height={320}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Welcome to <span className="rosca-green-text">CircleUp</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Join a trusted community where you can save and borrow money with friends and family.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/register" className="block">
            <Button className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-4 text-lg rounded-2xl">
              Sign Up
            </Button>
          </Link>
          <Link href="/login" className="block">
            <Button
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-800 py-4 text-lg rounded-2xl"
            >
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
