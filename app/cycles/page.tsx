import { BottomNavigation } from "@/components/bottom-navigation"

export default function CyclesPage() {
  return (
    <div className="min-h-screen rosca-bg text-white pb-20">
      <div className="max-w-sm mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Cycles</h1>
        <div className="text-center text-gray-400 mt-20">
          <p>Cycles page coming soon...</p>
        </div>
      </div>
      <BottomNavigation currentPage="cycles" />
    </div>
  )
}
