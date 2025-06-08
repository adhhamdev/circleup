"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Copy, Mail, Phone, Share2 } from "lucide-react"
import { InvitationService } from "@/lib/invitations"

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  cycleId: string
  userId: string
}

export function InviteModal({ isOpen, onClose, cycleId, userId }: InviteModalProps) {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleCreateInvite = async (type: "email" | "phone") => {
    setLoading(true)
    try {
      const contact = type === "email" ? email : phone
      const invitation = await InvitationService.createInvitation(cycleId, userId, contact, type)
      setInviteCode(invitation.invite_code)
      setSuccess(true)
    } catch (error) {
      console.error("Error creating invitation:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyInviteLink = () => {
    const link = `${window.location.origin}/invite/${inviteCode}`
    navigator.clipboard.writeText(link)
  }

  const shareInvite = async () => {
    const link = `${window.location.origin}/invite/${inviteCode}`
    if (navigator.share) {
      await navigator.share({
        title: "Join my ROSCA Circle",
        text: "You're invited to join my savings circle on CircleUp!",
        url: link,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm rosca-card border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Invite Members</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          {!success ? (
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="email" className="data-[state=active]:bg-[#7ED321] data-[state=active]:text-black">
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="data-[state=active]:bg-[#7ED321] data-[state=active]:text-black">
                  Phone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-2 border-gray-600 rounded-2xl text-white"
                  />
                </div>
                <Button
                  onClick={() => handleCreateInvite("email")}
                  disabled={loading || !email}
                  className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-3 rounded-2xl"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {loading ? "Creating..." : "Send Invite"}
                </Button>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-transparent border-2 border-gray-600 rounded-2xl text-white"
                  />
                </div>
                <Button
                  onClick={() => handleCreateInvite("phone")}
                  disabled={loading || !phone}
                  className="w-full rosca-green hover:bg-[#6BC91A] text-black font-semibold py-3 rounded-2xl"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {loading ? "Creating..." : "Send Invite"}
                </Button>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-green-500/20 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-2">Invitation Created!</h3>
                <p className="text-gray-300 text-sm mb-4">Share this code with your friend:</p>
                <div className="bg-gray-800 p-3 rounded-xl">
                  <code className="text-[#7ED321] font-mono text-lg">{inviteCode}</code>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={copyInviteLink}
                  variant="outline"
                  className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button onClick={shareInvite} className="flex-1 rosca-green hover:bg-[#6BC91A] text-black">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
