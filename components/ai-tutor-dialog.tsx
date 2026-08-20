"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Bot, Send, Loader2, X, Lightbulb } from "lucide-react"

interface AITutorDialogProps {
  currentQuestion: any
  onClose: () => void
}

export function AITutorDialog({ currentQuestion, onClose }: AITutorDialogProps) {
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    {
      sender: "ai",
      text: `Hi there! I'm your AI Study Buddy 🤖. Working on this ${currentQuestion.subject} question? Ask me for a hint or explanation anytime!`,
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage
    if (!textToSend.trim()) return

    const newMessages = [...messages, { sender: "user" as const, text: textToSend }]
    setMessages(newMessages)
    if (!customText) setInputMessage("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          userMessage: textToSend,
        }),
      })

      const data = await res.json()
      setMessages([...newMessages, { sender: "ai", text: data.reply || "Take a deep breath and review the choices!" }])
    } catch (e) {
      console.error(e)
      setMessages([
        ...newMessages,
        { sender: "ai", text: "Look closely at key keywords in the question!" },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-primary/30 flex flex-col max-h-[85vh] bg-background">
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between bg-primary/5">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
            <Bot className="h-6 w-6 text-primary" />
            AI Study Buddy Tutor
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        {/* Current Question Snippet */}
        <div className="p-3 bg-muted/40 text-xs border-b">
          <span className="font-semibold text-primary">Question:</span> "{currentQuestion.question}"
        </div>

        {/* Chat Log */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl text-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                    : "bg-muted text-foreground rounded-tl-none border"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-xl text-sm flex items-center gap-2 border">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>AI Tutor is thinking...</span>
              </div>
            </div>
          )}
        </CardContent>

        {/* Quick Action Chips */}
        <div className="p-2 border-t flex flex-wrap gap-1 bg-muted/20">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 gap-1"
            onClick={() => sendMessage("Can you give me a subtle hint?")}
          >
            <Lightbulb className="h-3 w-3 text-yellow-500" />
            Give me a hint
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 gap-1"
            onClick={() => sendMessage("Explain this simpler please.")}
          >
            <Brain className="h-3 w-3 text-primary" />
            Explain simpler
          </Button>
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t flex gap-2">
          <input
            type="text"
            placeholder="Ask your AI Tutor anything..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button size="sm" onClick={() => sendMessage()} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
