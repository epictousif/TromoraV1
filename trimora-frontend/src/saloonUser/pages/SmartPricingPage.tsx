import { Card } from '@/components/ui/card'

export default function SmartPricingPage() {
  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Smart Pricing</h1>
        <p className="text-muted-foreground mt-1">Automate dynamic prices based on demand, time slots, and utilization.</p>
      </div>

      <Card className="p-6">
        <p className="text-sm text-muted-foreground">Coming soon: rules for peak/off-peak multipliers, min/max caps, and service-specific strategies.</p>
      </Card>
    </div>
  )
}
