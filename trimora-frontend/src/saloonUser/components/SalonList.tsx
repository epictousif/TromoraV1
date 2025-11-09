import { useEffect, useMemo, useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Star, 
  Eye,
  Plus,
  Loader2,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useSalon } from '../hooks/useSalon';
import type { Salon } from '../types/salon';

interface SalonListProps {
  onAddSalon?: () => void;
  onEditSalon?: (salon: Salon) => void;
  onViewSalon?: (salon: Salon) => void;
}

export const SalonList = ({ onAddSalon, onEditSalon, onViewSalon }: SalonListProps) => {
  const { salons, isLoading, error, deleteSalon, totalCount, refreshUserSalons, user } = useSalon();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'city' | 'rating' | 'openTime'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const safeSalons: Salon[] = Array.isArray(salons) ? salons : [];
  if (!Array.isArray(salons)) {
    console.warn('[SalonList] salons is not an array, value:', salons);
  }

  // Debug: log state to console
  useEffect(() => {
    // Only log when not loading to reduce noise
    if (!isLoading) {
      console.info('[SalonList] State -> isLoading:', isLoading, 'error:', error, 'count:', safeSalons.length, 'totalCount:', totalCount);
      if (safeSalons.length > 0) {
        console.debug('[SalonList] First salon sample:', safeSalons[0]);
      }
    }
  }, [isLoading, error, safeSalons, totalCount]);

  const filteredSorted = useMemo(() => {
    const term = search.trim().toLowerCase();
    let data = safeSalons;
    if (term) {
      data = data.filter((s) =>
        s.name.toLowerCase().includes(term) ||
        s.location?.city?.toLowerCase().includes(term) ||
        s.location?.state?.toLowerCase().includes(term) ||
        s.phone?.toLowerCase().includes(term)
      );
    }
    const sorted = [...data].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'rating':
          return ((a.rating || 0) - (b.rating || 0)) * dir;
        case 'city':
          return (a.location?.city || '').localeCompare(b.location?.city || '') * dir;
        case 'openTime':
          return (a.openTime || '').localeCompare(b.openTime || '') * dir;
        default:
          return (a.name || '').localeCompare(b.name || '') * dir;
      }
    });
    return sorted;
  }, [safeSalons, search, sortKey, sortDir]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result = await deleteSalon(id);
      if (result.success) {
        // Success feedback could be added here
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading salons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building className="h-6 w-6" />
            My Salons
          </h2>
          <p className="text-muted-foreground">
            {totalCount} salon{totalCount !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, phone..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => user?.id && refreshUserSalons()}
            >
              Refresh
            </Button>
            {onAddSalon && (
              <Button 
                onClick={onAddSalon}
                className="bg-black hover:bg-black text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Salon
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredSorted.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Building className="h-12 w-12 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No salons found</h3>
              <p className="text-gray-600">Get started by adding your first salon</p>
            </div>
            {onAddSalon && (
              <Button 
                onClick={onAddSalon}
                className="bg-black hover:bg-black text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Salon
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort('name')}>
                  Name {sortKey === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort('city')}>
                  City {sortKey === 'city' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort('openTime')}>
                  Hours {sortKey === 'openTime' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort('rating')}>
                  Rating {sortKey === 'rating' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-4 py-3 font-medium">Services</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSorted.map((salon, idx) => (
                <tr key={salon._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {salon.badge && (
                        <Badge variant="outline" className="text-[10px]">{salon.badge}</Badge>
                      )}
                      <div className="font-medium line-clamp-1">{salon.name}</div>
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {salon.location.address}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {salon.location.city}, {salon.location.state}
                  </td>
                  <td className="px-4 py-3">{salon.phone}</td>
                  <td className="px-4 py-3">{salon.openTime} - {salon.closingTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{salon.rating}</span>
                      <span className="text-gray-400">({salon.reviews})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[280px]">
                      {salon.services.slice(0, 3).map(s => (
                        <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                      ))}
                      {salon.services.length > 3 && (
                        <Badge variant="outline" className="text-[10px]">+{salon.services.length - 3} more</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {onViewSalon && (
                        <Button variant="outline" size="sm" onClick={() => onViewSalon(salon)}>
                          <Eye className="mr-1 h-3 w-3" /> View
                        </Button>
                      )}
                      {onEditSalon && (
                        <Button variant="outline" size="sm" onClick={() => onEditSalon(salon)}>
                          <Edit className="mr-1 h-3 w-3" /> Edit
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={deletingId === salon._id}
                          >
                            {deletingId === salon._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Salon</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{salon.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(salon._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
