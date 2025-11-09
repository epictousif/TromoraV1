import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [range, setRange] = useState('last_30');
  const [employee, setEmployee] = useState('all');
  const [category, setCategory] = useState('all');

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex items-center gap-3">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7">Last 7 days</SelectItem>
              <SelectItem value="last_30">Last 30 days</SelectItem>
              <SelectItem value="last_90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={employee} onValueChange={setEmployee}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Employee" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bookings vs Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-md border border-dashed flex items-center justify-center text-sm text-muted-foreground">
              Combined chart placeholder
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-md border border-dashed flex items-center justify-center text-sm text-muted-foreground">
              Utilization chart placeholder
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Service Split</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-md border border-dashed flex items-center justify-center text-sm text-muted-foreground">
              Pie chart placeholder (services)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Split</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 rounded-md border border-dashed flex items-center justify-center text-sm text-muted-foreground">
              Pie chart placeholder (categories)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
