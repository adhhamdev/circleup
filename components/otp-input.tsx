"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface OtpInputProps {
  length: number
  onComplete: (otp: string) => void
  value: string
  onChange: (value: string) => void
}

export function OtpInput({ length, onComplete, value, onChange }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (value) {
      const otpArray = value.split("").slice(0, length)
      while (otpArray.length < length) {
        otpArray.push("")
      }
      setOtp(otpArray)
    }
  }, [value, length])

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    const otpString = newOtp.join("")
    onChange(otpString)

    // Focus next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Call onComplete when all fields are filled
    if (otpString.length === length) {
      onComplete(otpString)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex justify-center space-x-2">
      {otp.map((data, index) => (
        <Input
          key={index}
          type="text"
          maxLength={1}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-12 h-12 text-center text-2xl bg-transparent border-2 border-gray-600 rounded-2xl text-white focus:border-[#7ED321]"
        />
      ))}
    </div>
  )
}
