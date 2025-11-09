import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BadgePercent, Zap, Clock, ArrowRight, ArrowLeft } from 'lucide-react'

export default function DealsPage() {
  const [showTypeSelector, setShowTypeSelector] = useState(false)

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Deals</h1>
        <p className="text-muted-foreground mt-1">Create and manage promotional deals for your salon.</p>
      </div>

      {!showTypeSelector ? (
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Reward and retain clients with deals</h2>
            <p className="text-sm text-muted-foreground">
              Whether you create discount codes for holidays, off-peak prices or offers to attract new clients, deals are a great way to increase sales.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Create and share a promotion with a discount code</li>
              <li>Introduce a flash sale to get more bookings</li>
              <li>Quickly fill your calendar with last-minute offers</li>
              <li>Control and track the performance of all deals from one place</li>
            </ul>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button onClick={() => setShowTypeSelector(true)}>
                Start now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="link" className="px-0">Learn more</Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <div className="-mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTypeSelector(false)}
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 border border-blue-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          {/* Deal type selector */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Select deal type</h2>
            <p className="text-sm text-muted-foreground">
              Choose the type of deal you want to create. <a href="#" className="underline underline-offset-4">Learn more</a>
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Promotion */}
            <Card className="hover:bg-muted/40 transition-colors">
              <CardHeader className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <BadgePercent className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">Promotion</CardTitle>
                <CardDescription>
                  Create a discount redeemed by clients entering the code when booking online or during checkout at Point of Sale
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Flash sale */}
            <Card className="hover:bg-muted/40 transition-colors">
              <CardHeader className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Zap className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">Flash sale</CardTitle>
                <CardDescription>
                  Immediately apply a discount online and let your team members manually add it to appointments and sales
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Last-minute offer */}
            <Card className="hover:bg-muted/40 transition-colors">
              <CardHeader className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">Last-minute offer</CardTitle>
                <CardDescription>
                  Apply a discount for bookings made just before an appointment starts
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
