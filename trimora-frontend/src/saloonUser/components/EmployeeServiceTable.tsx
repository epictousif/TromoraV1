import { useState } from 'react';
import type { EmployeeServiceItem } from '../services/employeeServicesService';
import { useEmployeeServicesStore } from '../store/employeeServicesStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type Props = {
  services: EmployeeServiceItem[];
  onEdit: (svc: EmployeeServiceItem) => void;
};

export default function EmployeeServiceTable({ services, onEdit }: Props) {
  const { toggle, remove, isLoading } = useEmployeeServicesStore();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const onToggle = async (id: string) => {
    setPendingId(id);
    await toggle(id);
    setPendingId(null);
  };

  const onDelete = async (id: string) => {
    setPendingId(id);
    await remove(id);
    setPendingId(null);
  };

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th className="px-4 py-3 font-medium">Service</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Duration</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No services found</td>
            </tr>
          ) : (
            services.map((svc) => (
              <tr key={svc._id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{svc.name}</div>
                  {svc.description ? <div className="text-xs text-muted-foreground line-clamp-1">{svc.description}</div> : null}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="uppercase tracking-wide text-[10px]">{svc.category}</Badge>
                </td>
                <td className="px-4 py-3">{svc.duration}m</td>
                <td className="px-4 py-3">₹ {svc.price}</td>
                <td className="px-4 py-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <Checkbox checked={svc.isActive} disabled={pendingId === svc._id || isLoading} onCheckedChange={() => onToggle(svc._id)} />
                    <span className="text-xs">{svc.isActive ? 'Active' : 'Inactive'}</span>
                  </label>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(svc)} disabled={pendingId === svc._id || isLoading}>Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" disabled={pendingId === svc._id || isLoading}>Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete service?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(svc._id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
