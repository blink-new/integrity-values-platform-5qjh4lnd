import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Target, MessageCircle, CheckCircle, ArrowLeft, Send } from 'lucide-react'
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
      content: "Hello! I'm here to help you discover and define your core values. This is a foundational step in building your personal accountability framework.\\n\\nLet's start with understanding what drives you. Can you tell me about a time when you felt most proud of yourself? What values were you honoring in that moment?"
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-foreground font-serif">Define Your Values</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-sm font-medium text-muted-foreground">
                Progress: <span className="text-foreground">{values.length}/6 values</span>
              </div>
              <Progress value={progress} className="w-40 h-2" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Chat Interface */}
          <Card className="h-[700px] flex flex-col shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <span className="font-serif">AI Values Coach</span>
              </CardTitle>
              <CardDescription className="text-base">
                Let's discover your core values through guided conversation
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-4 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Input */}
              <div className="flex space-x-3">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts and experiences..."
                  className="flex-1 min-h-[80px] resize-none"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                  className="self-end bg-primary hover:bg-primary/90 px-4 py-3 h-auto"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Values Document */}
          <Card className="h-[700px] flex flex-col shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-serif">Your Values Document</span>
              </CardTitle>
              <CardDescription className="text-base">
                Your defined values will appear here in real-time
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto">
              {values.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-serif">
                    Ready to Begin?
                  </h3>
                  <p className="text-muted-foreground">
                    Start chatting with the AI coach to discover your authentic values
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Base Values */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Badge className="bg-primary text-white">Base Values</Badge>
                      <span className="text-sm text-muted-foreground">(2 required)</span>
                    </div>
                    <div className="space-y-4">
                      {values.filter(v => v.type === 'base').map((value) => (
                        <Card key={value.id} className="border-l-4 border-l-primary bg-primary/5">
                          <CardContent className="pt-6">
                            <h4 className="text-lg font-bold text-foreground mb-3 font-serif">{value.name}</h4>
                            <p className="text-muted-foreground mb-4 italic font-serif text-base leading-relaxed">
                              "{value.statement}"
                            </p>
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-foreground">Key Principles:</p>
                              {value.principles.map((principle, idx) => (
                                <p key={idx} className="text-sm text-muted-foreground">• {principle}</p>
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
                      <div className="flex items-center space-x-3 mb-4">
                        <Badge className="bg-secondary text-white">Top Values</Badge>
                        <span className="text-sm text-muted-foreground">(4 required)</span>
                      </div>
                      <div className="space-y-4">
                        {values.filter(v => v.type === 'top').map((value) => (
                          <Card key={value.id} className="border-l-4 border-l-secondary bg-secondary/5">
                            <CardContent className="pt-6">
                              <h4 className="text-lg font-bold text-foreground mb-3 font-serif">{value.name}</h4>
                              <p className="text-muted-foreground mb-4 italic font-serif text-base leading-relaxed">
                                "{value.statement}"
                              </p>
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-foreground">Key Principles:</p>
                                {value.principles.map((principle, idx) => (
                                  <p key={idx} className="text-sm text-muted-foreground">• {principle}</p>
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
                    <div className="pt-6 border-t">
                      <Button onClick={handleComplete} className="w-full bg-secondary hover:bg-secondary/90 h-12 text-base font-medium shadow-lg">
                        <CheckCircle className="w-5 h-5 mr-2" />
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