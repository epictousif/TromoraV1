import employeeApi from './employeeApi';

export type Employee = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  salon: string; // salon id
  salonUser: string; // owner id
  isActive: boolean;
  experience: number;
  rating?: number;
  totalBookings?: number;
  profileImage?: string | null;
  specialization: string[];
  workingHours?: Record<string, { isWorking: boolean; startTime: string; endTime: string }>;
};

// Ensure consistent shapes coming from varying backend/cache responses
function normalizeEmployee(input: any): Employee {
  const specArr: string[] = Array.isArray(input?.specialization)
    ? input.specialization
    : (typeof input?.specialization === 'string'
        ? (() => { try { return JSON.parse(input.specialization); } catch { return []; } })()
        : []);
  const working = typeof input?.workingHours === 'string'
    ? (() => { try { return JSON.parse(input.workingHours); } catch { return undefined; } })()
    : input?.workingHours;
  return {
    _id: String(input?._id || ''),
    name: String(input?.name || ''),
    email: String(input?.email || ''),
    phoneNumber: String(input?.phoneNumber || input?.phone || ''),
    salon: typeof input?.salon === 'object' && input?.salon !== null ? String(input.salon._id || '') : String(input?.salon || ''),
    salonUser: typeof input?.salonUser === 'object' && input?.salonUser !== null ? String(input.salonUser._id || '') : String(input?.salonUser || ''),
    isActive: typeof input?.isActive === 'boolean' ? input.isActive : Boolean(input?.isActive ?? true),
    experience: typeof input?.experience === 'number' ? input.experience : Number(input?.experience ?? 0),
    rating: typeof input?.rating === 'number' ? input.rating : (input?.rating != null ? Number(input.rating) : undefined),
    totalBookings: typeof input?.totalBookings === 'number' ? input.totalBookings : (input?.totalBookings != null ? Number(input.totalBookings) : undefined),
    profileImage: input?.profileImage ?? undefined,
    specialization: specArr,
    workingHours: working,
  } as Employee;
}

export type CreateEmployeeRequest = Omit<Employee, '_id' | 'totalBookings' | 'rating' | 'profileImage'> & {
  profileImage?: File | null;
};

export type UpdateEmployeeRequest = Partial<CreateEmployeeRequest> & { _id: string };

export class EmployeeService {
  static async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
    console.info('[EmployeeService] createEmployee start', { data: { ...data, profileImage: !!data.profileImage } });
    const form = new FormData();
    form.append('name', data.name);
    form.append('email', data.email);
    form.append('phoneNumber', data.phoneNumber);
    form.append('salon', data.salon);
    form.append('salonUser', data.salonUser);
    form.append('isActive', String(data.isActive));
    form.append('experience', String(data.experience ?? 0));
    // Backend expects specialization as JSON string when multipart
    form.append('specialization', JSON.stringify(data.specialization ?? []));
    if (data.workingHours) {
      form.append('workingHours', JSON.stringify(data.workingHours));
    }
    if (data.profileImage) {
      form.append('profileImage', data.profileImage);
    }

    const res = await employeeApi.post<any>('create', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const raw = res.data;
    const emp: Employee = raw?.employee ? normalizeEmployee(raw.employee) : normalizeEmployee(raw);
    console.info('[EmployeeService] createEmployee success', { id: emp._id });
    return emp;
  }

  static async updateEmployee(data: UpdateEmployeeRequest): Promise<Employee> {
    // Use FormData if file present, else JSON
    console.info('[EmployeeService] updateEmployee start', { id: data._id, hasFile: data.profileImage instanceof File });
    if (data.profileImage instanceof File) {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v === undefined || k === '_id') return;
        if (Array.isArray(v)) {
          if (k === 'specialization') {
            form.append(k, JSON.stringify(v));
          } else {
            v.forEach((item) => form.append(k, String(item)));
          }
        } else {
          if (k === 'workingHours' && v && typeof v === 'object') {
            form.append(k, JSON.stringify(v));
          } else {
            form.append(k, String(v as any));
          }
        }
      });
      form.append('isActive', String(data.isActive ?? true));
      const res = await employeeApi.put<any>(`update/${data._id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const raw = res.data;
      const emp: Employee = raw?.employee ? normalizeEmployee(raw.employee) : normalizeEmployee(raw);
      console.info('[EmployeeService] updateEmployee success (multipart)', { id: emp._id });
      return emp;
    } else {
      const payload: any = { ...data };
      delete payload._id;
      const res = await employeeApi.put<any>(`update/${data._id}`, payload);
      const raw = res.data;
      const emp: Employee = raw?.employee ? normalizeEmployee(raw.employee) : normalizeEmployee(raw);
      console.info('[EmployeeService] updateEmployee success (json)', { id: emp._id });
      return emp;
    }
  }

  static async deleteEmployee(id: string): Promise<void> {
    console.info('[EmployeeService] deleteEmployee start', { id });
    await employeeApi.delete(`delete/${id}`);
    console.info('[EmployeeService] deleteEmployee success', { id });
  }

  static async getEmployeeById(id: string): Promise<Employee> {
    console.info('[EmployeeService] getEmployeeById start', { id });
    if (!id) {
      console.warn('[EmployeeService] getEmployeeById aborted: missing id');
      throw new Error('Missing employee id');
    }
    const res = await employeeApi.get<any>(`details/${id}?_ts=${Date.now()}`);
    const raw = res.data;
    const emp: Employee | undefined =
      (raw && raw.employee) ? normalizeEmployee(raw.employee) :
      (raw && raw.data && raw.data.employee) ? normalizeEmployee(raw.data.employee) :
      (raw && raw._id) ? normalizeEmployee(raw) : undefined;
    console.info('[EmployeeService] getEmployeeById success', { hasWrapper: !!raw?.employee, id: emp?._id });
    if (!emp) throw new Error('Employee not found in response');
    return emp;
  }

  static async listEmployees(): Promise<Employee[]> {
    console.info('[EmployeeService] listEmployees start');
    const res = await employeeApi.get<any>('list');
    const data = res.data;
    const arrRaw = Array.isArray(data) ? data : (Array.isArray(data?.employees) ? data.employees : []);
    const arr = arrRaw.map(normalizeEmployee);
    console.info('[EmployeeService] listEmployees success', { count: arr.length, rawType: typeof data });
    return arr;
  }

  static async listBySalon(salonId: string): Promise<Employee[]> {
    console.info('[EmployeeService] listBySalon start', { salonId });
    const res = await employeeApi.get<any>(`by-salon/${salonId}?_ts=${Date.now()}`);
    const data = res.data;
    const arrRaw = Array.isArray(data) ? data : (Array.isArray(data?.employees) ? data.employees : []);
    const arr = arrRaw.map(normalizeEmployee);
    console.info('[EmployeeService] listBySalon success', { count: arr.length });
    return arr;
  }

  static async listBySalonUser(salonUserId: string): Promise<Employee[]> {
    console.info('[EmployeeService] listBySalonUser start', { salonUserId });
    const res = await employeeApi.get<any>(`by-salonUser/${salonUserId}?_ts=${Date.now()}`);
    const data = res.data;
    const arrRaw = Array.isArray(data) ? data : (Array.isArray(data?.employees) ? data.employees : []);
    const arr = arrRaw.map(normalizeEmployee);
    console.info('[EmployeeService] listBySalonUser success', { count: arr.length });
    return arr;
  }

  static async toggleStatus(id: string): Promise<Employee> {
    const res = await employeeApi.patch<Employee>(`toggle-status/${id}`);
    return res.data;
  }
}
