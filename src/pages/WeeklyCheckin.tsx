import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Target, ArrowLeft, ChevronDown, ChevronRight, CheckCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'

interface Principle {
  id: string
  name: string
  rating: number
}

interface Value {
  id: string
  name: string
  type: 'base' | 'top'
  principles: Principle[]
  isExpanded: boolean
}

const getEmojiForRating = (rating: number) => {
  if (rating <= 2) return '😰'
  if (rating <= 4) return '😟'
  if (rating <= 6) return '😐'
  if (rating <= 8) return '🙂'
  return '😍'
}

export default function WeeklyCheckin() {
  const [user, setUser] = useState(null)
  const [values, setValues] = useState<Value[]>([
    {
      id: '1',
      name: 'Authenticity',
      type: 'base',
      isExpanded: true,
      principles: [
        { id: '1-1', name: 'Be honest in all communications', rating: 7 },
        { id: '1-2', name: 'Act according to my true beliefs', rating: 8 },
        { id: '1-3', name: 'Admit when I make mistakes', rating: 6 }
      ]
    },
    {
      id: '2',
      name: 'Growth',
      type: 'base',
      isExpanded: false,
      principles: [
        { id: '2-1', name: 'Seek learning opportunities daily', rating: 5 },
        { id: '2-2', name: 'Embrace challenges as growth', rating: 7 },
        { id: '2-3', name: 'Reflect on experiences regularly', rating: 8 }
      ]
    },
    {
      id: '3',
      name: 'Compassion',
      type: 'top',
      isExpanded: false,
      principles: [
        { id: '3-1', name: 'Listen with empathy', rating: 9 },
        { id: '3-2', name: 'Help others without expectation', rating: 6 },
        { id: '3-3', name: 'Practice self-compassion', rating: 4 }
      ]
    }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const toggleValueExpansion = (valueId: string) => {
    setValues(prev => prev.map(value => 
      value.id === valueId 
        ? { ...value, isExpanded: !value.isExpanded }
        : value
    ))
  }

  const updatePrincipleRating = (valueId: string, principleId: string, rating: number) => {
    setValues(prev => prev.map(value => 
      value.id === valueId 
        ? {
            ...value,
            principles: value.principles.map(principle =>
              principle.id === principleId
                ? { ...principle, rating }
                : principle
            )
          }
        : value
    ))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call to save ratings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real app, save to database using blink.db
      console.log('Submitting ratings:', values)
      
      navigate('/dashboard')
    } catch (error) {
      console.error('Error submitting check-in:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const allRatingsComplete = values.every(value => 
    value.principles.every(principle => principle.rating > 0)
  )

  const averageScore = Math.round(
    values.reduce((acc, value) => 
      acc + value.principles.reduce((sum, principle) => sum + principle.rating, 0), 0
    ) / values.reduce((acc, value) => acc + value.principles.length, 0)
  )

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Weekly Check-in</span>
              </div>
            </div>
            
            <div className="text-sm text-slate-600">
              Week of {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How was your week?</CardTitle>
            <CardDescription>
              Rate how easy it was to live by each principle this past week. 
              1 = Very difficult, 10 = Very easy. Be honest with yourself.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Values and Principles */}
        <div className="space-y-4 mb-8">
          {values.map((value) => (
            <Card key={value.id}>
              <Collapsible 
                open={value.isExpanded} 
                onOpenChange={() => toggleValueExpansion(value.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {value.isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                          )}
                          <CardTitle className="text-lg">{value.name}</CardTitle>
                        </div>
                        <Badge variant={value.type === 'base' ? 'default' : 'secondary'}>
                          {value.type === 'base' ? 'Base Value' : 'Top Value'}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        {value.principles.length} principles
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {value.principles.map((principle) => (
                        <div key={principle.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-900">
                              {principle.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">
                                {getEmojiForRating(principle.rating)}
                              </span>
                              <span className="text-sm font-medium text-slate-700 w-6">
                                {principle.rating}
                              </span>
                            </div>
                          </div>
                          
                          <div className="px-3">
                            <Slider
                              value={[principle.rating]}
                              onValueChange={(value) => 
                                updatePrincipleRating(value.id, principle.id, value[0])
                              }
                              max={10}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                              <span>Very difficult</span>
                              <span>Very easy</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Summary and Submit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Check-in Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">
                  Overall Integrity Score for this week
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {averageScore}/10
                  </span>
                  <span className="text-2xl">
                    {getEmojiForRating(averageScore)}
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={handleSubmit}
                disabled={!allRatingsComplete || isSubmitting}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? 'Submitting...' : 'Complete Check-in'}
              </Button>
            </div>
            
            {!allRatingsComplete && (
              <p className="text-sm text-amber-600">
                Please rate all principles before submitting your check-in.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}