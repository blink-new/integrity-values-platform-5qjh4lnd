import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Target, TrendingUp, CheckCircle, Plus, LogOut } from 'lucide-react'
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
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Integrity</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-slate-900 font-medium">
                Dashboard
              </Link>
              <Link to="/dashboard/weekly-checkin" className="text-slate-600 hover:text-slate-900">
                Weekly Check-in
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Welcome, {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user.email?.split('@')[0]}
          </h1>
          <p className="text-slate-600">
            Here's your integrity overview and progress.
          </p>
        </div>

        {/* Integrity Summary */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Integrity Score</span>
              </CardTitle>
              <CardDescription>
                Your overall alignment with your core values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl font-bold text-blue-600">
                  {integrityScore}%
                </div>
                <div className="flex-1">
                  <Progress value={integrityScore} className="h-3" />
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Based on your latest weekly check-in. Great work maintaining your principles!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>This Week</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Check-in</span>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Promise</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <Link to="/dashboard/weekly-checkin">
                  <Button size="sm" className="w-full mt-4">
                    New Check-in
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Values</CardTitle>
            <CardDescription>
              Your core principles and how you're living them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Define Your Values
              </h3>
              <p className="text-slate-600 mb-6">
                Start your journey by defining your core values and principles.
              </p>
              <Link to="/dashboard/define-values">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Promise</CardTitle>
              <CardDescription>
                Make a commitment for this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                No active promise this week. Create one to stay accountable.
              </p>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Promise
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Insights</CardTitle>
              <CardDescription>
                Areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Complete your value definition to see personalized insights.
              </p>
              <Button variant="outline" className="w-full" disabled>
                View Insights
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}