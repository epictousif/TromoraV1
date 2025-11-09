import { useMemo, useState } from 'react';
import { useEmployee } from '../hooks/useEmployee';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Search, Filter, Eye } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface Props {
  onCreate?: () => void;
  onEdit?: (id: string) => void;
}

export default function EmployeeList({ onCreate, onEdit }: Props) {
  const { employees, isLoading, error, deleteEmployee, clearError } = useEmployee();
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<'name'|'experience'|'rating'>('name');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const [viewingId, setViewingId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const data = Array.isArray(employees) ? employees : [];
    const filtered = q
      ? data.filter(e => [e.name, e.email, e.phoneNumber].some(v => v?.toLowerCase().includes(q.toLowerCase())))
      : data;
    const sorted = [...filtered].sort((a,b) => {
      const aVal = (a as any)[sortKey] ?? '';
      const bVal = (b as any)[sortKey] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [employees, q, sortKey, sortDir]);

  // sorting handled via select above; no separate toggle handler needed

  const onDelete = async (id: string) => {
    clearError();
    const ok = confirm('Delete this employee?');
    if (!ok) return;
    await deleteEmployee(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative max-w-sm w/full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search staff..." className="pl-8" disabled />
          </div>
          <Button disabled className="gap-2"><Plus className="h-4 w-4"/> Add Employee</Button>
        </div>
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3">Employee</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-left p-3">Specialization</th>
                  <th className="text-left p-3">Exp</th>
                  <th className="text-left p-3">Rating</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b animate-pulse">
                    <td className="p-3">
                      <div className="h-4 w-48 bg-muted rounded" />
                    </td>
                    <td className="p-3"><div className="h-3 w-40 bg-muted rounded"/></td>
                    <td className="p-3"><div className="h-3 w-28 bg-muted rounded"/></td>
                    <td className="p-3"><div className="h-3 w-36 bg-muted rounded"/></td>
                    <td className="p-3"><div className="h-3 w-10 bg-muted rounded"/></td>
                    <td className="p-3"><div className="h-3 w-10 bg-muted rounded"/></td>
                    <td className="p-3"><div className="h-5 w-16 bg-muted rounded"/></td>
                    <td className="p-3 text-right"><div className="h-8 w-40 bg-muted rounded"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name, email, phone"
              value={q}
              onChange={e => setQ(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <select
              className="border rounded-md h-9 px-2 bg-background"
              value={`${sortKey}:${sortDir}`}
              onChange={(e) => {
                const [k, d] = e.target.value.split(':') as [typeof sortKey, typeof sortDir];
                setSortKey(k); setSortDir(d);
              }}
            >
              <option value="name:asc">Name ↑</option>
              <option value="name:desc">Name ↓</option>
              <option value="experience:asc">Experience ↑</option>
              <option value="experience:desc">Experience ↓</option>
              <option value="rating:asc">Rating ↑</option>
              <option value="rating:desc">Rating ↓</option>
            </select>
          </div>
        </div>
        <Button onClick={onCreate} className="gap-2"><Plus className="h-4 w-4"/> Add Employee</Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</Card>
      )}

      {/* Empty */}
      {rows.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-base font-medium">No staff yet</div>
          <div className="text-sm text-muted-foreground mt-1">Get started by creating your first employee.</div>
          <Button onClick={onCreate} className="mt-4 gap-2"><Plus className="h-4 w-4"/> Add Employee</Button>
        </Card>
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3">Employee</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-left p-3">Specialization</th>
                  <th className="text-left p-3">Exp</th>
                  <th className="text-left p-3">Rating</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e._id} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {e.profileImage ? (
                          <img src={e.profileImage} alt={e.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted" />
                        )}
                        <div>
                          <div className="font-medium">{e.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{e.email}</td>
                    <td className="p-3">{e.phoneNumber}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(e.specialization) ? e.specialization : []).slice(0, 3).map((s, i) => (
                          <Badge key={i} variant="outline">{s}</Badge>
                        ))}
                        {Array.isArray(e.specialization) && e.specialization.length > 3 ? (
                          <Badge variant="outline">+{e.specialization.length - 3}</Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-3">{e.experience ?? 0}y</td>
                    <td className="p-3">{e.rating ?? 5}</td>
                    <td className="p-3">
                      <Badge variant={e.isActive ? 'default' : 'secondary'}>{e.isActive ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" className="gap-1" onClick={() => setViewingId(e._id)}><Eye className="h-4 w-4"/>View</Button>
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => onEdit?.(e._id)}><Edit className="h-4 w-4"/>Edit</Button>
                        <Button size="sm" variant="destructive" className="gap-1" onClick={() => onDelete(e._id)}><Trash2 className="h-4 w-4"/>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* View Modal */}
      <AlertDialog open={!!viewingId} onOpenChange={(open: boolean) => { if (!open) setViewingId(null); }}>
        <AlertDialogContent className="max-w-xl max-h-[70vh] overflow-y-auto">
          {(() => {
            const e = (Array.isArray(employees) ? employees : []).find(x => x._id === viewingId);
            if (!e) return (
              <div className="p-4 text-sm text-muted-foreground">No data</div>
            );
            return (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle>{e.name}</AlertDialogTitle>
                  <AlertDialogDescription>Employee details</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mt-2 grid grid-cols-1 gap-6 text-sm">
                  <div className="flex items-start gap-4">
                    {e.profileImage ? (
                      <img src={e.profileImage} alt={e.name} className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-muted" />
                    )}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-muted-foreground">Email</div>
                        <div>{e.email}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Phone</div>
                        <div>{e.phoneNumber}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Experience</div>
                        <div>{e.experience ?? 0} years</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Status</div>
                        <div><Badge variant={e.isActive ? 'default' : 'secondary'}>{e.isActive ? 'Active' : 'Inactive'}</Badge></div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Rating</div>
                        <div>{e.rating ?? 5}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Specialization</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(e.specialization || []).map((s, i) => <Badge key={i} variant="outline">{s}</Badge>)}
                    </div>
                  </div>
                  {e.workingHours ? (
                    <div>
                      <div className="text-muted-foreground mb-2">Working Hours</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs md:text-sm">
                          <thead>
                            <tr className="border-b bg-muted/30">
                              <th className="text-left p-2">Day</th>
                              <th className="text-left p-2">Working</th>
                              <th className="text-left p-2">Start</th>
                              <th className="text-left p-2">End</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const).map((day) => {
                              const d = (e as any).workingHours?.[day];
                              return (
                                <tr key={day} className="border-b">
                                  <td className="p-2 capitalize">{day}</td>
                                  <td className="p-2">{d?.isWorking ? 'Yes' : 'No'}</td>
                                  <td className="p-2">{d?.startTime || '-'}</td>
                                  <td className="p-2">{d?.endTime || '-'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </div>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel onClick={() => setViewingId(null)}>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </>
            );
          })()}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
