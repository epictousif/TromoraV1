import { useCallback, useEffect } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import { useAuthStore } from '../store/authStore';
import type { CreateEmployeeRequest, UpdateEmployeeRequest } from '../services/employeeService';

export function useEmployee() {
  const {
    employees,
    current,
    isLoading,
    error,
    clearError,
    setCurrent,
    reset,
    fetchBySalonUser,
    fetchBySalon,
    fetchAll,
    getById,
    create,
    update,
    remove,
  } = useEmployeeStore();

  const { user } = useAuthStore();

  useEffect(() => {
    // Clear stale employees when user context changes, then fetch fresh
    reset();
    if (user?.id) {
      console.info('[useEmployee] auto-fetch by salonUser start', { userId: user.id });
      fetchBySalonUser(user.id).then((res) => {
        if (!res.success) {
          console.error('[useEmployee] auto-fetch error', res.error);
        } else {
          console.info('[useEmployee] auto-fetch success', { count: res.data?.length || 0 });
        }
      });
    }
  }, [user?.id, fetchBySalonUser, reset]);

  useEffect(() => {
    console.info('[useEmployee] state', {
      isLoading,
      error,
      employeesCount: Array.isArray(employees) ? employees.length : 'non-array',
    });
  }, [employees, isLoading, error]);

  const createEmployee = useCallback((payload: CreateEmployeeRequest) => create(payload), [create]);
  const updateEmployee = useCallback((payload: UpdateEmployeeRequest) => update(payload), [update]);
  const deleteEmployee = useCallback((id: string) => remove(id), [remove]);

  return {
    employees,
    current,
    isLoading,
    error,
    clearError,
    setCurrent,
    fetchBySalonUser,
    fetchBySalon,
    fetchAll,
    getById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
