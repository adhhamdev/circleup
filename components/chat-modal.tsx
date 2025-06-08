"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Send, MessageCircle } from "lucide-react"
import { ChatService, type Message } from "@/lib/chat"
import { useAuth } from "@/hooks/use-auth"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  cycleId: string
  cycleName: string
}

export function ChatModal({ isOpen, onClose, cycleId, cycleName }: ChatModalProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && cycleId) {
      loadMessages()
      const subscription = ChatService.subscribeToMessages(cycleId, (message) => {
        setMessages((prev) => [...prev, message])
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [isOpen, cycleId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      const data = await ChatService.getCycleMessages(cycleId)
      setMessages(data || [])
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || loading) return

    setLoading(true)
    try {
      await ChatService.sendMessage(cycleId, user.id, newMessage)
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm h-[600px] rosca-card border-0 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
          <CardTitle className="text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            {cycleName}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.user_id === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.user_id === user?.id ? "bg-[#7ED321] text-black" : "bg-gray-700 text-white"
                    }`}
                  >
                    {message.user_id !== user?.id && (
                      <p className="text-xs opacity-70 mb-1">{message.users.full_name}</p>
                    )}
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-gray-600 text-white rounded-2xl"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !newMessage.trim()}
                className="rosca-green hover:bg-[#6BC91A] text-black rounded-2xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
