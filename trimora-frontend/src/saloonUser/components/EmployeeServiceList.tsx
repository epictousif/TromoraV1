import { useMemo, useState } from 'react';
import { useEmployeeServicesStore } from '../store/employeeServicesStore';
import type { EmployeeServiceItem } from '../services/employeeServicesService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

type Props = {
  services: EmployeeServiceItem[];
  onEdit: (svc: EmployeeServiceItem) => void;
};

export default function EmployeeServiceList({ services, onEdit }: Props) {
  const { toggle, remove, isLoading } = useEmployeeServicesStore();
  const [pending, setPending] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...services].sort((a, b) => a.name.localeCompare(b.name));
  }, [services]);

  const onToggle = async (id: string) => {
    setPending(id);
    await toggle(id);
    setPending(null);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    setPending(id);
    await remove(id);
    setPending(null);
  };

  if (!sorted.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">No services yet.</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sorted.map((svc) => (
        <Card key={svc._id}>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{svc.name}</CardTitle>
              <Badge variant="outline" className="uppercase tracking-wide text-[10px]">{svc.category}</Badge>
            </div>
            <Badge variant={svc.isActive ? 'default' : 'secondary'}>{svc.isActive ? 'Active' : 'Inactive'}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-muted px-2 py-1">⏱ {svc.duration}m</span>
              <span className="rounded-full bg-muted px-2 py-1">₹ {svc.price}</span>
            </div>
            {svc.description ? (
              <p className="text-sm text-muted-foreground">{svc.description}</p>
            ) : (
              <p className="text-xs text-muted-foreground">No description</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <Checkbox checked={svc.isActive} disabled={pending === svc._id || isLoading} onCheckedChange={() => onToggle(svc._id)} />
                <span className="text-sm">{svc.isActive ? 'Active' : 'Inactive'}</span>
              </label>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(svc)} disabled={pending === svc._id || isLoading}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(svc._id)} disabled={pending === svc._id || isLoading}>Delete</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
