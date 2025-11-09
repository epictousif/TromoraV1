import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/authStore';
import { useSalonStore } from '../store/salonStore';
import { useEmployeeStore } from '../store/employeeStore';
import { useEmployeeServicesStore } from '../store/employeeServicesStore';
import type { EmployeeServiceItem } from '../services/employeeServicesService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const SERVICE_NAMES = [
  'Hair Cut',
  'Hair Wash',
  'Beard Trim',
  'Shave',
  'Hair Color',
  'Hair Style',
  'Facial',
  'Massage',
  'Manicure',
  'Pedicure',
] as const;

const CATEGORIES = ['Hair', 'Beard', 'Facial', 'Nail', 'Massage'] as const;

const schema = z.object({
  employee: z.string().min(1, 'Select employee'),
  salon: z.string().min(1, 'Select salon'),
  salonUser: z.string().min(1, 'Missing salon user'),
  name: z.enum(SERVICE_NAMES),
  category: z.enum(CATEGORIES),
  duration: z.coerce.number().int().min(15).max(180),
  price: z.coerce.number().min(0),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type EmployeeServiceFormValues = z.infer<typeof schema>;

type Props = {
  defaultSalonId?: string;
  selectedSalonId?: string;
  selectedEmployeeId?: string;
  hideSelectors?: boolean; // hide salon/employee selectors when controlled by parent
  editing?: EmployeeServiceItem | null;
  onSuccess?: (svc: EmployeeServiceItem) => void;
  onCancel?: () => void;
};

export default function EmployeeServiceForm({ defaultSalonId, selectedSalonId: selectedSalonIdProp, selectedEmployeeId: selectedEmployeeIdProp, hideSelectors = false, editing, onSuccess, onCancel }: Props) {
  const { user } = useAuthStore();
  const { salons, getSalons } = useSalonStore();
  const { employees, fetchBySalon, fetchBySalonUser } = useEmployeeStore();
  const { create, update, isLoading, error, clearError } = useEmployeeServicesStore();

  const [selectedSalonId, setSelectedSalonId] = useState<string>(editing?.salon || selectedSalonIdProp || defaultSalonId || '');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(editing?.employee || selectedEmployeeIdProp || '');

  const form = useForm<EmployeeServiceFormValues>({
    // Cast to any to avoid react-hook-form Resolver typing mismatch with zod coerced numbers
    resolver: zodResolver(schema) as any,
    mode: 'onChange',
    defaultValues: {
      employee: editing?.employee || '',
      salon: editing?.salon || defaultSalonId || '',
      salonUser: user?.id || '',
      name: (editing?.name as any) || 'Hair Cut',
      category: (editing?.category as any) || 'Hair',
      duration: editing?.duration || 30,
      price: editing?.price || 0,
      description: editing?.description || '',
      isActive: editing?.isActive ?? true,
    },
  });

  // Load salons (names and ids) if needed
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      if (!salons || salons.length === 0) {
        await getSalons(user.id);
      }
    };
    load();
  }, [user?.id, salons?.length, getSalons]);

  // Load employees for selected salon or by owner fallback
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

  // Sync from parent-controlled selections if provided
  useEffect(() => {
    if (selectedSalonIdProp && selectedSalonIdProp !== selectedSalonId) {
      setSelectedSalonId(selectedSalonIdProp);
    }
  }, [selectedSalonIdProp]);
  useEffect(() => {
    if (selectedEmployeeIdProp && selectedEmployeeIdProp !== selectedEmployeeId) {
      setSelectedEmployeeId(selectedEmployeeIdProp);
    }
  }, [selectedEmployeeIdProp]);

  // Sync local selects with form values
  useEffect(() => {
    form.setValue('salon', selectedSalonId);
  }, [selectedSalonId]);
  useEffect(() => {
    form.setValue('employee', selectedEmployeeId);
  }, [selectedEmployeeId]);
  useEffect(() => {
    if (user?.id) form.setValue('salonUser', user.id);
  }, [user?.id]);

  const employeeOptions = useMemo(() => employees.map(e => ({ id: e._id, name: e.name })), [employees]);

  const onSubmit = async (values: EmployeeServiceFormValues) => {
    clearError();
    if (!values.employee || !values.salon || !values.salonUser) return;
    try {
      if (editing) {
        const res = await update({
          _id: editing._id,
          employee: values.employee,
          salon: values.salon,
          salonUser: values.salonUser,
          name: values.name,
          category: values.category,
          duration: values.duration,
          price: values.price,
          description: values.description,
          isActive: values.isActive,
        });
        if (res.success && res.data) onSuccess?.(res.data);
      } else {
        const res = await create(values.employee, {
          salon: values.salon,
          salonUser: values.salonUser,
          name: values.name,
          category: values.category,
          duration: values.duration,
          price: values.price,
          description: values.description,
          isActive: values.isActive,
        });
        if (res.success && res.data) {
          onSuccess?.(res.data);
          form.reset({
            employee: values.employee,
            salon: values.salon,
            salonUser: values.salonUser,
            name: 'Hair Cut',
            category: 'Hair',
            duration: 30,
            price: 0,
            description: '',
            isActive: true,
          });
        }
      }
    } catch (e) {
      // handled in store
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-sm text-red-600">{error}</CardContent>
        </Card>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!hideSelectors && (
            <div className="space-y-2 md:col-span-2">
              <Label>Salon *</Label>
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
          )}

          {!hideSelectors && (
            <div className="space-y-2 md:col-span-2">
              <Label>Employee *</Label>
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
          )}

          <div className="space-y-2">
            <Label>Service Name *</Label>
            <Select value={form.watch('name')} onValueChange={(v) => form.setValue('name', v as any, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_NAMES.map((n) => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={form.watch('category')} onValueChange={(v) => form.setValue('category', v as any, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Duration (minutes) *</Label>
            <Input type="number" min={15} max={180} {...form.register('duration')} />
            <p className="text-xs text-muted-foreground">Typical range 15–180 minutes.</p>
          </div>

          <div className="space-y-2">
            <Label>Price *</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">₹</span>
              <Input className="flex-1" type="number" min={0} step={1} {...form.register('price')} />
            </div>
            <p className="text-xs text-muted-foreground">Enter price in INR.</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea rows={3} placeholder="Short description (optional)" {...form.register('description')} />
          </div>

          <label className="flex items-center gap-3 md:col-span-2 cursor-pointer select-none">
            <Checkbox checked={form.watch('isActive')} onCheckedChange={(v) => form.setValue('isActive', Boolean(v))} />
            <span className="text-sm">Active</span>
          </label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>{editing ? 'Update' : 'Create'}</Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          )}
        </div>
      </form>
    </div>
  );
}
