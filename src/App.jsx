import { useState, useEffect } from 'react'
import { xAuthService } from './services/xAuthService.js'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  Users, 
  BarChart3, 
  Calendar, 
  DollarSign,
  LogOut,
  Shield,
  Eye,
  EyeOff,
  TrendingUp,
  Activity,
  Settings,
  Bell
} from 'lucide-react'

// X Logo Component
const XIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
import './App.css'

// Authentication context with X OAuth support
const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we're returning from X OAuth callback
        if (xAuthService.isCallback()) {
          const { oauthToken, oauthVerifier } = xAuthService.getCallbackParams()
          
          if (oauthToken && oauthVerifier) {
            // Handle X OAuth callback
            const authResult = await xAuthService.handleCallback(oauthToken, oauthVerifier)
            
            // Create user data from X response
            const userData = {
              id: authResult.userInfo.id,
              username: authResult.userInfo.username,
              role: 'raider',
              avatar: authResult.userInfo.profileImageUrl,
              connectedX: true,
              xAccessToken: authResult.accessToken,
              xAccessTokenSecret: authResult.accessTokenSecret,
              displayName: authResult.userInfo.displayName,
              verified: authResult.userInfo.verified
            }
            
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
            xAuthService.clearCallbackParams()
            setIsLoading(false)
            return
          }
        }
        
        // Check for existing session
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Clear any invalid session data
        localStorage.removeItem('user')
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const loginWithX = async () => {
    try {
      await xAuthService.initiateAuth()
    } catch (error) {
      console.error('X login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return { user, login, loginWithX, logout, isLoading }
}

// Login Component
const LoginScreen = ({ onLogin, onLoginWithX }) => {
  const [loginType, setLoginType] = useState('admin')
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isLoadingX, setIsLoadingX] = useState(false)

  const handleLogin = () => {
    if (credentials.username && credentials.password) {
      const userData = {
        id: Date.now(),
        username: credentials.username,
        role: loginType,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username}`,
        connectedX: loginType === 'raider' ? Math.random() > 0.5 : true
      }
      onLogin(userData)
    }
  }

  const handleXLogin = async () => {
    setIsLoadingX(true)
    try {
      console.log('🔐 Starting X login process...')
      await onLoginWithX()
    } catch (error) {
      console.error('❌ X login failed:', error)
      alert('X login failed. Please try again.')
      setIsLoadingX(false)
    }
    // Note: Don't set loading to false here as the page will redirect
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-gray-900 border-gray-700">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <XIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">X Raider Tracker</CardTitle>
              <p className="text-gray-300 mt-2">Sign in to your account</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={loginType === 'admin' ? 'default' : 'outline'}
                onClick={() => setLoginType('admin')}
                className={loginType === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
              <Button
                variant={loginType === 'raider' ? 'default' : 'outline'}
                onClick={() => setLoginType('raider')}
                className={loginType === 'raider' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                <Users className="h-4 w-4 mr-2" />
                Raider
              </Button>
            </div>
            
            {loginType === 'admin' && (
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Username</Label>
                  <Input
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            {loginType === 'raider' ? (
              <Button 
                onClick={handleXLogin}
                disabled={isLoadingX}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
              >
                <XIcon className="h-4 w-4 mr-2" />
                {isLoadingX ? 'Connecting to X...' : 'Login with X Account'}
              </Button>
            ) : (
              <Button 
                onClick={handleLogin} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
              >
                Sign In
              </Button>
            )}

            {loginType === 'raider' && (
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Raiders must login with their X account
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Admin Dashboard
const AdminDashboard = ({ user, onLogout }) => {
  const [raiders, setRaiders] = useState([
    { 
      id: 1, 
      handle: '@raider1', 
      verified: true, 
      totalEarned: 300, 
      activeDays: 30,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raider1',
      connectedX: true,
      lastActive: '2025-09-13'
    },
    { 
      id: 2, 
      handle: '@raider2', 
      verified: true, 
      totalEarned: 280, 
      activeDays: 28,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raider2',
      connectedX: true,
      lastActive: '2025-09-13'
    },
    { 
      id: 3, 
      handle: '@raider3', 
      verified: false, 
      totalEarned: 0, 
      activeDays: 0,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raider3',
      connectedX: false,
      lastActive: 'Never'
    },
  ])

  const [dailyRecords, setDailyRecords] = useState([
    {
      id: 1,
      date: '2025-09-13',
      raiderHandle: '@raider1',
      postUrl: 'https://x.com/user/status/123',
      impressions: 1500,
      likes: 12,
      retweets: 8,
      replies: 3,
      kpiMet: true,
      paymentStatus: 'paid',
      earnings: 10
    },
    {
      id: 2,
      date: '2025-09-13',
      raiderHandle: '@raider2',
      postUrl: 'https://x.com/user/status/123',
      impressions: 800,
      likes: 5,
      retweets: 2,
      replies: 1,
      kpiMet: false,
      paymentStatus: 'unpaid',
      earnings: 0
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showPayments, setShowPayments] = useState(false)

  const filteredRaiders = raiders.filter(raider =>
    raider.handle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const todayRecords = dailyRecords.filter(record => record.date === new Date().toISOString().split('T')[0])
  const kpiMetToday = todayRecords.filter(record => record.kpiMet).length
  const totalPaymentsToday = todayRecords.reduce((sum, record) => sum + (record.paymentStatus === 'paid' ? record.earnings : 0), 0)
  const connectedRaiders = raiders.filter(raider => raider.connectedX).length

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <XIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">X Raider Tracker</h1>
                <p className="text-sm text-gray-300">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPayments(!showPayments)}
                className="text-gray-300 hover:text-white"
              >
                {showPayments ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPayments ? 'Hide' : 'Show'} Payments
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-300">{user.username}</span>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Raiders</p>
                  <p className="text-3xl font-bold">{raiders.length}</p>
                  <p className="text-blue-100 text-xs mt-1">{connectedRaiders} connected</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">KPI Met Today</p>
                  <p className="text-3xl font-bold">{kpiMetToday}</p>
                  <p className="text-green-100 text-xs mt-1">of {todayRecords.length} submissions</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Payments Today</p>
                  <p className="text-3xl font-bold">${totalPaymentsToday}</p>
                  <p className="text-purple-100 text-xs mt-1">{todayRecords.filter(r => r.paymentStatus === 'paid').length} payments made</p>
                </div>
                <DollarSign className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Success Rate</p>
                  <p className="text-3xl font-bold">{todayRecords.length > 0 ? Math.round((kpiMetToday / todayRecords.length) * 100) : 0}%</p>
                  <p className="text-orange-100 text-xs mt-1">Today's performance</p>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="raiders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900 shadow-sm border">
            <TabsTrigger value="raiders" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Raiders Management
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Performance Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="raiders">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-white">Raider Management</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search raiders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 border-gray-600"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {filteredRaiders.map((raider) => (
                    <div key={raider.id} className="p-6 hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={raider.avatar} />
                            <AvatarFallback>{raider.handle.charAt(1).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold text-white">{raider.handle}</p>
                              {raider.connectedX && <XIcon className="h-4 w-4 text-blue-500" />}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              {showPayments && <span>${raider.totalEarned} earned</span>}
                              <span>{raider.activeDays} days active</span>
                              <span>Last: {raider.lastActive}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={raider.connectedX ? "default" : "secondary"} className="border-0">
                            {raider.connectedX ? "Connected" : "Not Connected"}
                          </Badge>
                          <Badge variant={raider.verified ? "default" : "secondary"} className="border-0">
                            {raider.verified ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Unverified
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="text-xl font-semibold text-white">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-800">
                      <TableHead className="font-semibold text-gray-300">Date</TableHead>
                      <TableHead className="font-semibold text-gray-300">Raider</TableHead>
                      <TableHead className="font-semibold text-gray-300">Impressions</TableHead>
                      <TableHead className="font-semibold text-gray-300">Engagement</TableHead>
                      <TableHead className="font-semibold text-gray-300">KPI Status</TableHead>
                      {showPayments && <TableHead className="font-semibold text-gray-300">Payment</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-gray-800">
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">{record.raiderHandle.charAt(1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{record.raiderHandle}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{record.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center space-x-1 text-sm">
                            <span>{record.likes}❤️</span>
                            <span>{record.retweets}🔄</span>
                            <span>{record.replies}💬</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={record.kpiMet ? "default" : "destructive"} className="border-0">
                            {record.kpiMet ? "✓ Met" : "✗ Not Met"}
                          </Badge>
                        </TableCell>
                        {showPayments && (
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant={record.paymentStatus === 'paid' ? "default" : "secondary"} className="border-0">
                                {record.paymentStatus === 'paid' ? "Paid" : "Unpaid"}
                              </Badge>
                              {record.paymentStatus === 'paid' && (
                                <span className="text-sm font-medium text-green-600">${record.earnings}</span>
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Raider Dashboard
const RaiderDashboard = ({ user, onLogout }) => {
  const [myRecords, setMyRecords] = useState([
    {
      id: 1,
      date: '2025-09-13',
      postUrl: 'https://x.com/user/status/123',
      impressions: 1500,
      likes: 12,
      retweets: 8,
      replies: 3,
      kpiMet: true,
      status: 'approved'
    }
  ])

  const [newSubmission, setNewSubmission] = useState({
    postUrl: '',
    impressions: '',
    screenshot: null
  })

  const [isSubmitOpen, setIsSubmitOpen] = useState(false)

  const submitRecord = () => {
    if (newSubmission.postUrl && newSubmission.impressions) {
      const record = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        postUrl: newSubmission.postUrl,
        impressions: parseInt(newSubmission.impressions),
        likes: 0,
        retweets: 0,
        replies: 0,
        kpiMet: parseInt(newSubmission.impressions) >= 1000,
        status: 'pending'
      }
      setMyRecords([...myRecords, record])
      setNewSubmission({ postUrl: '', impressions: '', screenshot: null })
      setIsSubmitOpen(false)
    }
  }

  const totalEarnings = myRecords.filter(r => r.kpiMet && r.status === 'approved').length * 10
  const thisMonthRecords = myRecords.filter(r => r.date.startsWith('2025-09')).length
  const successRate = myRecords.length > 0 ? Math.round((myRecords.filter(r => r.kpiMet).length / myRecords.length) * 100) : 0

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <XIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Raider Dashboard</h1>
                <p className="text-sm text-gray-500">Track your performance and earnings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!user.connectedX && (
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <XIcon className="h-4 w-4 mr-2" />
                  Connect X Account
                </Button>
              )}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-300">{user.username}</span>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold">{thisMonthRecords}</p>
                  <p className="text-green-100 text-xs mt-1">submissions</p>
                </div>
                <Activity className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Success Rate</p>
                  <p className="text-3xl font-bold">{successRate}%</p>
                  <p className="text-blue-100 text-xs mt-1">KPI achievement</p>
                </div>
                <TrendingUp className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">X Account</p>
                  <p className="text-xl font-bold">{user.connectedX ? 'Connected' : 'Not Connected'}</p>
                  <p className="text-purple-100 text-xs mt-1">{user.connectedX ? 'Ready to raid' : 'Connect to start'}</p>
                </div>
                <XIcon className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submission Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold text-white">Submit Performance</CardTitle>
              <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Submission
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-0 shadow-lg">
                  <DialogHeader>
                    <DialogTitle className="font-semibold">Submit Performance Record</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-300">Post URL</Label>
                      <Input
                        placeholder="https://x.com/user/status/..."
                        value={newSubmission.postUrl}
                        onChange={(e) => setNewSubmission({...newSubmission, postUrl: e.target.value})}
                        className="border-gray-600"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-300">Impressions</Label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={newSubmission.impressions}
                        onChange={(e) => setNewSubmission({...newSubmission, impressions: e.target.value})}
                        className="border-gray-600"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 1,000 impressions required</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-300">Screenshot (Optional)</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewSubmission({...newSubmission, screenshot: e.target.files[0]})}
                        className="border-gray-600"
                      />
                    </div>
                    <Button onClick={submitRecord} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Submit Record
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-800">
                  <TableHead className="font-semibold text-gray-300">Date</TableHead>
                  <TableHead className="font-semibold text-gray-300">Post URL</TableHead>
                  <TableHead className="font-semibold text-gray-300">Impressions</TableHead>
                  <TableHead className="font-semibold text-gray-300">KPI Status</TableHead>
                  <TableHead className="font-semibold text-gray-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-gray-800">
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell>
                      <a href={record.postUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        View Post
                      </a>
                    </TableCell>
                    <TableCell className="font-medium">{record.impressions.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={record.kpiMet ? "default" : "destructive"} className="border-0">
                        {record.kpiMet ? "✓ Met" : "✗ Not Met"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={record.status === 'approved' ? "default" : record.status === 'pending' ? "secondary" : "destructive"} 
                        className="border-0"
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const { user, login, loginWithX, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onLogin={login} onLoginWithX={loginWithX} />
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={logout} />
  }

  return <RaiderDashboard user={user} onLogout={logout} />
}

export default App
