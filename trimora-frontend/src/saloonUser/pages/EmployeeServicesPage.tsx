import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSalonStore } from '../store/salonStore';
import { useEmployeeStore } from '../store/employeeStore';
import { useEmployeeServicesStore } from '../store/employeeServicesStore';
import EmployeeServiceForm from '../components/EmployeeServiceForm';
import EmployeeServiceTable from '../components/EmployeeServiceTable';
import type { EmployeeServiceItem } from '../services/employeeServicesService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function EmployeeServicesPage() {
  const { user } = useAuthStore();
  const { salons, getSalons } = useSalonStore();
  const { employees, fetchBySalon, fetchBySalonUser } = useEmployeeStore();
  const { services, fetchByEmployee } = useEmployeeServicesStore();

  const [selectedSalonId, setSelectedSalonId] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [editing, setEditing] = useState<EmployeeServiceItem | null>(null);
  const [open, setOpen] = useState(false);

  // Load salons for user
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      if (!salons || salons.length === 0) {
        await getSalons(user.id);
      }
    };
    load();
  }, [user?.id, salons?.length, getSalons]);

  // When salon changes, load employees for that salon
  useEffect(() => {
    const load = async () => {
      if (selectedSalonId) {
        await fetchBySalon(selectedSalonId);
      } else if (user?.id) {
        await fetchBySalonUser(user.id);
      }
    };
    load();
  }, [selectedSalonId, user?.id, fetchBySalon, fetchBySalonUser]);

  // When employee changes, load their services
  useEffect(() => {
    const load = async () => {
      if (selectedEmployeeId) {
        await fetchByEmployee(selectedEmployeeId, { isActive: 'all' });
      }
    };
    load();
  }, [selectedEmployeeId, fetchByEmployee]);

  // Preselect first salon and employee if available
  useEffect(() => {
    if (!selectedSalonId && salons && salons.length > 0) {
      setSelectedSalonId(salons[0]._id);
    }
  }, [salons, selectedSalonId]);

  useEffect(() => {
    if (!selectedEmployeeId && employees && employees.length > 0) {
      setSelectedEmployeeId(employees[0]._id);
    }
  }, [employees, selectedEmployeeId]);

  const employeeOptions = useMemo(() => employees.map(e => ({ id: e._id, name: e.name })), [employees]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Manage Employee Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Salon</label>
              <Select value={selectedSalonId} onValueChange={setSelectedSalonId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a salon" />
                </SelectTrigger>
                <SelectContent>
                  {(salons || []).map((s) => (
                    <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Employee</label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employeeOptions.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            Services {selectedEmployeeId ? `(${services.length})` : ''}
          </CardTitle>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button disabled={!selectedEmployeeId} onClick={() => setEditing(null)}>Add Service</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl">
              <SheetHeader>
                <SheetTitle>{editing ? 'Edit Service' : 'Add Service'}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 pb-6">
                <EmployeeServiceForm
                  selectedSalonId={selectedSalonId}
                  selectedEmployeeId={selectedEmployeeId}
                  hideSelectors
                  editing={editing}
                  onSuccess={() => {
                    if (selectedEmployeeId) fetchByEmployee(selectedEmployeeId, { isActive: 'all' });
                    setEditing(null);
                    setOpen(false);
                  }}
                  onCancel={() => {
                    setEditing(null);
                    setOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          <EmployeeServiceTable
            services={services}
            onEdit={(svc) => {
              setEditing(svc);
              setOpen(true);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
