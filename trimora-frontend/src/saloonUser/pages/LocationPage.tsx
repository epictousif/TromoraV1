import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LocationPage() {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Location</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input placeholder="Search places (autocomplete later)" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Address Line 1</Label>
                <Input />
              </div>
              <div className="space-y-2">
                <Label>Address Line 2</Label>
                <Input />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input />
              </div>
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input />
              </div>
            </div>
            <div className="pt-2">
              <Button>Save Location</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Map Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 rounded-md border border-dashed flex items-center justify-center text-sm text-muted-foreground">
              Map placeholder (Leaflet/Google)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
