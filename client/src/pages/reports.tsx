import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Activity, BarChart3, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const [, setLocation] = useLocation();

  const { data: reports } = useQuery({
    queryKey: ['/api/user/reports'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch reports');
      return response.json();
    }
  });

  const peakActivityData = [
    { hour: '6AM', count: 12 },
    { hour: '8AM', count: 28 },
    { hour: '10AM', count: 35 },
    { hour: '12PM', count: 42 },
    { hour: '2PM', count: 45 },
    { hour: '4PM', count: 38 },
    { hour: '6PM', count: 25 },
    { hour: '8PM', count: 18 },
    { hour: '10PM', count: 14 },
    { hour: '12AM', count: 8 },
  ];

  const handoverStatusData = [
    { name: 'Completed', value: 85, color: '#10b981' },
    { name: 'Processing', value: 12, color: '#f59e0b' },
    { name: 'Failed', value: 3, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-light-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/profile')}
            className="mr-4 text-medical-blue hover:text-blue-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Active Users</p>
                  <p className="text-2xl font-bold text-slate-800">{reports?.totalActiveUsers || 0}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Visits</p>
                  <p className="text-2xl font-bold text-slate-800">{reports?.totalVisits || 0}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">My Handovers</p>
                  <p className="text-2xl font-bold text-slate-800">{reports?.myHandoversCount || 0}</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Peak Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Peak Activity Times</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={peakActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Handover Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Handover Status Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={handoverStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {handoverStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800">Key Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Average completion time:</span>
                    <span className="font-medium">2.3 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Success rate:</span>
                    <span className="font-medium text-green-600">96.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Most active shift:</span>
                    <span className="font-medium">Day (7am-7pm)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800">Recommendations</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Peak usage occurs at 2PM - consider additional support</li>
                  <li>• Voice quality improved by 15% this month</li>
                  <li>• Consider using templates for common handover types</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}