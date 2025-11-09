export interface EmployeeServiceItem {
  _id: string
  employee: string
  salon: string
  salonUser: string
  name: string
  duration: number
  price: number
  isActive: boolean
  description?: string
  category?: string
  createdAt?: string
  updatedAt?: string
}
