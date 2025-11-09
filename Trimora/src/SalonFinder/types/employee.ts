export interface WorkingDay {
  isWorking: boolean
  startTime?: string
  endTime?: string
}

export interface WorkingHours {
  monday?: WorkingDay
  tuesday?: WorkingDay
  wednesday?: WorkingDay
  thursday?: WorkingDay
  friday?: WorkingDay
  saturday?: WorkingDay
  sunday?: WorkingDay
}

export interface Employee {
  _id: string
  name: string
  email?: string
  phoneNumber?: string
  salon: string
  salonUser: string
  isActive: boolean
  experience?: number
  rating?: number
  totalBookings?: number
  profileImage?: string
  specialization?: string[]
  workingHours?: WorkingHours
  createdAt?: string
  updatedAt?: string
}
