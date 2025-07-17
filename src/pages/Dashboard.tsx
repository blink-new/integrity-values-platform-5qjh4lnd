import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Target, TrendingUp, CheckCircle, Plus, LogOut, Calendar, Award } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [integrityScore, setIntegrityScore] = useState(85)
  const [hasValues, setHasValues] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    // Check if user has defined values
    // For now, we'll simulate this - in real app, check database
    const checkValues = async () => {
      // Simulate checking for values
      setHasValues(false) // Force redirect to define values for demo
    }
    checkValues()
  }, [])

  const handleLogout = () => {
    blink.auth.logout()
  }

  // Redirect to define values if user hasn't completed onboarding
  useEffect(() => {
    if (user && !hasValues) {
      navigate('/dashboard/define-values')
    }
  }, [user, hasValues, navigate])

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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground font-serif">Integrity</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-foreground font-semibold border-b-2 border-primary pb-1">
                Dashboard
              </Link>
              <Link to="/dashboard/weekly-checkin" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                Weekly Check-in
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">
                  {user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  Welcome back
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="font-medium">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 font-serif">
            Welcome back, {user.email?.split('@')[0]}
          </h1>
          <p className="text-xl text-muted-foreground">
            Here's your integrity overview and progress toward authentic living.
          </p>
        </div>

        {/* Integrity Summary */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <span className="font-serif">Integrity Score</span>
              </CardTitle>
              <CardDescription className="text-base">
                Your overall alignment with your core values and principles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6 mb-6">
                <div className="text-5xl font-bold text-primary font-serif">
                  {integrityScore}%
                </div>
                <div className="flex-1">
                  <Progress value={integrityScore} className="h-4" />
                </div>
              </div>
              <div className="bg-primary/5 rounded-xl p-4">
                <p className="text-foreground font-medium mb-1">
                  Excellent alignment with your principles
                </p>
                <p className="text-sm text-muted-foreground">
                  Based on your latest weekly check-in. You're living authentically and staying true to your values.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-serif">This Week</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg">
                  <span className="font-medium text-foreground">Check-in</span>
                  <Badge className="bg-secondary text-white">Completed</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-foreground">Promise</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <Link to="/dashboard/weekly-checkin" className="block">
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90 font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    New Check-in
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Overview */}
        <Card className="mb-12 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <span className="font-serif">Your Values</span>
            </CardTitle>
            <CardDescription className="text-base">
              Your core principles and how authentically you're living them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-serif">
                Define Your Values
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Begin your journey toward authentic living by defining your core values and principles 
                through our AI-guided discovery process.
              </p>
              <Link to="/dashboard/define-values">
                <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium px-8 py-3 h-auto">
                  <Plus className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-serif">Weekly Promise</span>
              </CardTitle>
              <CardDescription className="text-base">
                Make a meaningful commitment for this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-xl p-4 mb-6">
                <p className="text-muted-foreground mb-2">
                  No active promise this week
                </p>
                <p className="text-sm text-muted-foreground">
                  Create a weekly promise to stay accountable to your values and maintain consistent growth.
                </p>
              </div>
              <Button variant="outline" className="w-full font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Create Promise
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <span className="font-serif">Growth Insights</span>
              </CardTitle>
              <CardDescription className="text-base">
                Personalized areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-xl p-4 mb-6">
                <p className="text-muted-foreground mb-2">
                  Insights available after value definition
                </p>
                <p className="text-sm text-muted-foreground">
                  Complete your value definition to receive personalized insights about your growth opportunities.
                </p>
              </div>
              <Button variant="outline" className="w-full font-medium" disabled>
                View Insights
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}