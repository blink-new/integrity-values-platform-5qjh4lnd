import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Target, MessageCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'

interface Value {
  id: string
  name: string
  statement: string
  type: 'base' | 'top'
  order: number
  principles: string[]
}

export default function DefineValues() {
  const [user, setUser] = useState(null)
  const [values, setValues] = useState<Value[]>([])
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm here to help you discover and define your core values. This is a foundational step in building your personal accountability framework.\n\nLet's start with understanding what drives you. Can you tell me about a time when you felt most proud of yourself? What values were you honoring in that moment?"
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const progress = (values.length / 6) * 100

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userMessage = currentMessage
    setCurrentMessage('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Simulate AI response for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const responses = [
        "That's a powerful example. I can sense that authenticity and courage are important to you. Let's explore this further - what does authenticity mean to you in your daily life?",
        "Excellent insight. Based on what you've shared, I'd like to help you articulate your first core value. Would you say 'Authenticity' resonates with you as a foundational principle?",
        "Perfect! Let me help you craft a value statement for Authenticity. How about: 'I commit to being genuine and true to myself in all interactions, even when it's difficult.' Does this capture what authenticity means to you?"
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
      
      // Simulate adding a value after some conversation
      if (values.length < 6 && Math.random() > 0.7) {
        const newValue: Value = {
          id: `value-${Date.now()}`,
          name: values.length === 0 ? 'Authenticity' : values.length === 1 ? 'Growth' : `Value ${values.length + 1}`,
          statement: `I commit to living with ${values.length === 0 ? 'authenticity' : values.length === 1 ? 'continuous growth' : 'this principle'} in all aspects of my life.`,
          type: values.length < 2 ? 'base' : 'top',
          order: values.length + 1,
          principles: [
            'Be honest in all communications',
            'Act according to my true beliefs',
            'Admit when I make mistakes'
          ]
        }
        setValues(prev => [...prev, newValue])
      }
      
    } catch (error) {
      console.error('Error sending message:', error)
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleComplete = () => {
    // In real app, save values to database
    navigate('/dashboard')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Define Your Values</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                Progress: {values.length}/6 values
              </div>
              <Progress value={progress} className="w-32" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Chat Interface */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span>AI Values Coach</span>
              </CardTitle>
              <CardDescription>
                Let's discover your core values through guided conversation
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Input */}
              <div className="flex space-x-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts..."
                  className="flex-1 min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                  className="self-end"
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Values Document */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Your Values Document</span>
              </CardTitle>
              <CardDescription>
                Your defined values will appear here in real-time
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto">
              {values.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">
                    Start chatting with the AI coach to discover your values
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Base Values */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                      <Badge variant="secondary">Base Values</Badge>
                      <span className="text-sm text-slate-600">(2 required)</span>
                    </h3>
                    <div className="space-y-4">
                      {values.filter(v => v.type === 'base').map((value) => (
                        <Card key={value.id} className="border-l-4 border-l-blue-600">
                          <CardContent className="pt-4">
                            <h4 className="font-semibold text-slate-900 mb-2">{value.name}</h4>
                            <p className="text-sm text-slate-600 mb-3 italic font-serif">
                              "{value.statement}"
                            </p>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-slate-700">Key Principles:</p>
                              {value.principles.map((principle, idx) => (
                                <p key={idx} className="text-xs text-slate-600">• {principle}</p>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Top Values */}
                  {values.some(v => v.type === 'top') && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                        <Badge variant="secondary">Top Values</Badge>
                        <span className="text-sm text-slate-600">(4 required)</span>
                      </h3>
                      <div className="space-y-4">
                        {values.filter(v => v.type === 'top').map((value) => (
                          <Card key={value.id} className="border-l-4 border-l-emerald-600">
                            <CardContent className="pt-4">
                              <h4 className="font-semibold text-slate-900 mb-2">{value.name}</h4>
                              <p className="text-sm text-slate-600 mb-3 italic font-serif">
                                "{value.statement}"
                              </p>
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-700">Key Principles:</p>
                                {value.principles.map((principle, idx) => (
                                  <p key={idx} className="text-xs text-slate-600">• {principle}</p>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Complete Button */}
                  {values.length === 6 && (
                    <div className="pt-4 border-t">
                      <Button onClick={handleComplete} className="w-full bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Value Definition
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}