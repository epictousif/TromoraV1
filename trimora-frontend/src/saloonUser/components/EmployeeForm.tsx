import React, { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/authStore';
import { useSalonStore } from '../store/salonStore';
import { useEmployee } from '../hooks/useEmployee';
import type { Employee } from '../services/employeeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/,'Enter 10 digits'),
  experience: z.coerce.number().min(0).max(60).default(0),
  isActive: z.boolean().default(true),
  specialization: z.array(z.string()).min(1, 'Select at least 1 specialization'),
});

export type EmployeeFormValues = z.infer<typeof schema> & {
  profileImage?: File | null;
};

const SPECIALIZATIONS = [
  'Hair Specialist',
  'Beard Expert',
  'Color Expert',
  'Styling Expert',
  'Facial Expert',
];

type Props = {
  salonId: string;
  employee?: Employee | null;
  onSuccess?: (emp: Employee) => void;
  onCancel?: () => void;
};

export default function EmployeeForm({ salonId, employee, onSuccess, onCancel }: Props) {
  const { user } = useAuthStore();
  const { salons, getUserSalons, isLoading: salonsLoading } = useSalonStore();
  const { createEmployee, updateEmployee, isLoading, error, clearError } = useEmployee();
  const zodTypedResolver = zodResolver(schema) as Resolver<EmployeeFormValues>;
  const { register, handleSubmit, reset, setValue, formState: { errors, isValid } } = useForm<EmployeeFormValues>({
    resolver: zodTypedResolver,
    mode: 'onChange',
    defaultValues: { isActive: true, specialization: [], experience: 0 },
  });

  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSalonId, setSelectedSalonId] = useState<string>(salonId || '');
  const [workingHours, setWorkingHours] = useState<Record<string, { isWorking: boolean; startTime: string; endTime: string }>>({
    monday: { isWorking: true, startTime: '09:00', endTime: '18:00' },
    tuesday: { isWorking: true, startTime: '09:00', endTime: '18:00' },
    wednesday: { isWorking: true, startTime: '09:00', endTime: '18:00' },
    thursday: { isWorking: true, startTime: '09:00', endTime: '18:00' },
    friday: { isWorking: true, startTime: '09:00', endTime: '18:00' },
    saturday: { isWorking: true, startTime: '09:00', endTime: '18:00' },
    sunday: { isWorking: false, startTime: '10:00', endTime: '16:00' },
  });

  useEffect(() => {
    if (employee) {
      // Normalize incoming employee shape in case backend returns slight variations
      const normalizedPhone = (employee as any).phoneNumber ?? (employee as any).phone ?? '';
      const normalizedSpecs: string[] = Array.isArray(employee.specialization)
        ? employee.specialization
        : (typeof (employee as any).specialization === 'string'
            ? (() => { try { return JSON.parse((employee as any).specialization); } catch { return []; } })()
            : []);
      const normalizedWH: any = typeof (employee as any).workingHours === 'string'
        ? (() => { try { return JSON.parse((employee as any).workingHours); } catch { return undefined; } })()
        : (employee as any).workingHours;

      reset({
        name: employee.name || '',
        email: employee.email || '',
        phoneNumber: normalizedPhone,
        experience: typeof employee.experience === 'number' ? employee.experience : Number(employee.experience ?? 0),
        isActive: typeof employee.isActive === 'boolean' ? employee.isActive : true,
        specialization: normalizedSpecs,
      });
      setSelectedSpecs(normalizedSpecs);
      setImagePreview(employee.profileImage ?? null);
      // prefer employee's salon when editing; handle object vs id
      const salonIdFromEmployee = (typeof (employee as any).salon === 'object' && (employee as any).salon !== null)
        ? String((employee as any).salon._id || '')
        : String((employee as any).salon || '');
      setSelectedSalonId(salonIdFromEmployee || salonId || '');
      if (normalizedWH) {
        setWorkingHours(normalizedWH as any);
      }
    }
  }, [employee, reset]);

  useEffect(() => {
    setValue('specialization', selectedSpecs, { shouldValidate: true });
  }, [selectedSpecs, setValue]);

  // Load salons for current user if not present
  useEffect(() => {
    const loadSalons = async () => {
      if (!user?.id) return;
      if (!salons || salons.length === 0) {
        await getUserSalons(user.id);
      }
    };
    loadSalons();
  }, [user?.id, salons?.length, getUserSalons]);

  // If no salon selected but salons are available, preselect first
  useEffect(() => {
    if (!selectedSalonId && salons && salons.length > 0) {
      setSelectedSalonId(salons[0]._id);
    }
  }, [salons, selectedSalonId]);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((prev) => prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]);
  };

  const onSubmit = async (values: EmployeeFormValues) => {
    clearError();
    const ownerId = user?.id;
    if (!ownerId) {
      alert('Please login first');
      return;
    }
    if (!selectedSalonId) {
      alert('Please select a salon');
      return;
    }

    try {
      if (employee) {
        if (!employee._id) {
          alert('Missing employee id for update');
          return;
        }
        const res = await updateEmployee({
          _id: employee._id,
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          experience: values.experience,
          isActive: values.isActive,
          specialization: selectedSpecs,
          salon: selectedSalonId,
          salonUser: ownerId,
          profileImage: imageFile ?? undefined,
          workingHours,
        });
        if (res.success && res.data) {
          onSuccess?.(res.data);
        }
      } else {
        const res = await createEmployee({
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          experience: values.experience,
          isActive: values.isActive,
          specialization: selectedSpecs,
          salon: selectedSalonId,
          salonUser: ownerId,
          profileImage: imageFile ?? undefined,
          workingHours,
        });
        if (res.success && res.data) {
          onSuccess?.(res.data);
          reset({ isActive: true, specialization: [], experience: 0, name: '', email: '', phoneNumber: '' });
          setSelectedSpecs([]);
          setImageFile(null);
          setImagePreview(null);
          // keep selectedSalonId as is to speed up next create
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-sm text-red-600">{error}</CardContent>
        </Card>
      )}

      {Object.keys(errors).length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6 text-sm text-amber-700">Please fix highlighted fields.</CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="salon">Salon *</Label>
            <Select value={selectedSalonId} onValueChange={setSelectedSalonId}>
              <SelectTrigger id="salon">
                <SelectValue placeholder={salonsLoading ? 'Loading salons...' : 'Select a salon'} />
              </SelectTrigger>
              <SelectContent>
                {(salons || []).map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedSalonId && <p className="text-xs text-red-500">Please select a salon</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone *</Label>
            <Input id="phoneNumber" placeholder="10 digits" {...register('phoneNumber')} />
            {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Experience (years)</Label>
            <Input id="experience" type="number" step="1" min={0} max={60} {...register('experience')} />
            {errors.experience && <p className="text-xs text-red-500">{errors.experience.message as string}</p>}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Specialization *</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {SPECIALIZATIONS.map((s) => (
                <Badge
                  key={s}
                  onClick={() => toggleSpec(s)}
                  className={cn('cursor-pointer px-4 py-2', selectedSpecs.includes(s) ? 'bg-red-600 text-white' : 'border')}
                  variant={selectedSpecs.includes(s) ? 'default' : 'outline'}
                >
                  {s}
                </Badge>
              ))}
            </div>
            {errors.specialization && <p className="text-xs text-red-500 mt-2">{errors.specialization.message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Working Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {(['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const).map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-32 capitalize text-sm text-muted-foreground">{day}</div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={workingHours[day].isWorking}
                      onChange={(e) => setWorkingHours((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], isWorking: e.target.checked },
                      }))}
                    />
                    <span>Working</span>
                  </label>
                  <div className="flex items-center gap-2 ml-auto">
                    <Label htmlFor={`${day}-start`} className="text-xs">Start</Label>
                    <Input
                      id={`${day}-start`}
                      type="time"
                      value={workingHours[day].startTime}
                      onChange={(e) => setWorkingHours((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], startTime: e.target.value },
                      }))}
                      className="w-28"
                      disabled={!workingHours[day].isWorking}
                    />
                    <Label htmlFor={`${day}-end`} className="text-xs">End</Label>
                    <Input
                      id={`${day}-end`}
                      type="time"
                      value={workingHours[day].endTime}
                      onChange={(e) => setWorkingHours((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], endTime: e.target.value },
                      }))}
                      className="w-28"
                      disabled={!workingHours[day].isWorking}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input id="profileImage" type="file" accept="image/*" onChange={onImageChange} />
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="h-16 w-16 object-cover rounded" />
              ) : (
                <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading || !isValid} className="disabled:opacity-60">
            {isLoading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {employee ? 'Updating...' : 'Creating...'}</>) : (employee ? 'Update Employee' : 'Create Employee')}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
