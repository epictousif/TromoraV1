import { useMemo, useState } from 'react';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import { useEmployee } from '../hooks/useEmployee';
import { useSalonStore } from '../store/salonStore';
import type { Employee } from '../services/employeeService';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';

export default function EmployeesPage() {
  const { getById, setCurrent } = useEmployee();
  const { salons } = useSalonStore();

  const defaultSalonId = useMemo(() => (Array.isArray(salons) && salons[0]?._id) || '', [salons]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const onCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const onEdit = async (id: string) => {
    const res = await getById(id);
    if (res.success && res.data) {
      setEditing(res.data);
      setShowForm(true);
    }
  };

  const onClose = () => {
    setShowForm(false);
    setEditing(null);
    setCurrent(null);
  };

  return (
    <div className="p-4 lg:p-6">
      {!defaultSalonId ? (
        <Card className="p-6 text-sm text-muted-foreground">
          Please create a salon first to add staff.
        </Card>
      ) : null}

      <AlertDialog open={showForm} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
        <AlertDialogContent className="max-w-2xl sm:max-w-3xl overflow-y-auto max-h-[90vh]">
          <AlertDialogHeader>
            <AlertDialogTitle>{editing ? 'Edit Employee' : 'Add Employee'}</AlertDialogTitle>
            <AlertDialogDescription>
              {editing ? 'Update employee details and save changes.' : 'Fill the details to add a new staff member.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="pt-2">
            <EmployeeForm
              salonId={editing ? (editing.salon as any as string) : defaultSalonId}
              employee={editing}
              onSuccess={() => {
                onClose();
              }}
              onCancel={onClose}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <EmployeeList onCreate={onCreate} onEdit={onEdit} />
    </div>
  );
}
