import employeeServicesApi from './employeeServicesApi';

export type EmployeeServiceItem = {
  _id: string;
  employee: string; // employee id
  salon: string; // salon id
  salonUser: string; // owner id
  name: 'Hair Cut' | 'Hair Wash' | 'Beard Trim' | 'Shave' | 'Hair Color' | 'Hair Style' | 'Facial' | 'Massage' | 'Manicure' | 'Pedicure';
  duration: number; // minutes
  price: number;
  isActive: boolean;
  description?: string;
  category: 'Hair' | 'Beard' | 'Facial' | 'Nail' | 'Massage';
  createdAt?: string;
  updatedAt?: string;
};

export type CreateEmployeeServiceRequest = Omit<EmployeeServiceItem, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmployeeServiceRequest = Partial<CreateEmployeeServiceRequest> & { _id: string };

function normalize(input: any): EmployeeServiceItem {
  return {
    _id: String(input?._id || ''),
    employee: typeof input?.employee === 'object' && input?.employee ? String(input.employee._id || '') : String(input?.employee || ''),
    salon: typeof input?.salon === 'object' && input?.salon ? String(input.salon._id || '') : String(input?.salon || ''),
    salonUser: typeof input?.salonUser === 'object' && input?.salonUser ? String(input.salonUser._id || '') : String(input?.salonUser || ''),
    name: input?.name,
    duration: Number(input?.duration ?? 0),
    price: Number(input?.price ?? 0),
    isActive: Boolean(input?.isActive ?? true),
    description: input?.description ?? '',
    category: input?.category,
    createdAt: input?.createdAt,
    updatedAt: input?.updatedAt,
  } as EmployeeServiceItem;
}

export class EmployeeServicesService {
  // Create a service for an employee
  static async create(employeeId: string, data: Omit<CreateEmployeeServiceRequest, 'employee'>): Promise<EmployeeServiceItem> {
    const payload = { ...data, employee: employeeId };
    const res = await employeeServicesApi.post<any>(`employee/${employeeId}/create`, payload);
    const raw = res.data?.service ?? res.data;
    return normalize(raw);
  }

  static async update(data: UpdateEmployeeServiceRequest): Promise<EmployeeServiceItem> {
    const payload = { ...data } as any;
    delete payload._id;
    const res = await employeeServicesApi.put<any>(`update/${data._id}`, payload);
    const raw = res.data?.service ?? res.data;
    return normalize(raw);
  }

  static async remove(id: string): Promise<void> {
    await employeeServicesApi.delete(`delete/${id}`);
  }

  static async toggleStatus(id: string): Promise<EmployeeServiceItem> {
    const res = await employeeServicesApi.patch<any>(`toggle-status/${id}`);
    const raw = res.data?.service ?? res.data;
    return normalize(raw);
  }

  static async getById(id: string): Promise<EmployeeServiceItem> {
    const res = await employeeServicesApi.get<any>(`details/${id}`);
    const raw = res.data?.service ?? res.data;
    return normalize(raw);
  }

  static async listByEmployee(employeeId: string, opts?: { isActive?: boolean | 'all' }): Promise<EmployeeServiceItem[]> {
    const params: any = {};
    if (opts?.isActive !== undefined && opts.isActive !== 'all') params.isActive = String(opts.isActive);
    const res = await employeeServicesApi.get<any>(`employee/${employeeId}/list`, { params });
    const arr = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.services) ? res.data.services : []);
    return arr.map(normalize);
  }

  static async listBySalon(salonId: string, opts?: { isActive?: boolean | 'all' }): Promise<EmployeeServiceItem[]> {
    const params: any = {};
    if (opts?.isActive !== undefined && opts.isActive !== 'all') params.isActive = String(opts.isActive);
    const res = await employeeServicesApi.get<any>(`salon/${salonId}`, { params });
    const arr = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.services) ? res.data.services : []);
    return arr.map(normalize);
  }

  static async listBySalonUser(salonUserId: string, opts?: { isActive?: boolean | 'all' }): Promise<EmployeeServiceItem[]> {
    const params: any = {};
    if (opts?.isActive !== undefined && opts.isActive !== 'all') params.isActive = String(opts.isActive);
    const res = await employeeServicesApi.get<any>(`salonUser/${salonUserId}`, { params });
    const arr = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.services) ? res.data.services : []);
    return arr.map(normalize);
  }
}
