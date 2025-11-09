import { Routes, Route, Navigate } from "react-router-dom"
import { SalonSidebar } from "./salon-sidebar"
import { SalonNavbar } from "./salon-navbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SalonManagement } from "./pages/SalonManagement"
import EmployeeServicesPage from "./pages/EmployeeServicesPage"
import EmployeesPage from './pages/EmployeesPage'
import DashboardPage from './pages/DashboardPage';
import GalleryPage from './pages/GalleryPage';
import LocationPage from './pages/LocationPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DealsPage from './pages/DealsPage';
import SmartPricingPage from './pages/SmartPricingPage';

interface SalonUserLayoutProps {
  currentPage?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export default function SalonDashboardLayout({ currentPage = "Dashboard", breadcrumbs }: SalonUserLayoutProps) {
  return (
    <SidebarProvider>
      <SalonSidebar />
      <SidebarInset>
        <SalonNavbar currentPage={currentPage} breadcrumbs={breadcrumbs} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* This is where the nested routes will render */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<SalonManagement />} />
              <Route path="/salons/*" element={<SalonManagement />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/location" element={<LocationPage />} />
              <Route path="/locations" element={<LocationPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/employee-services" element={<EmployeeServicesPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/smart-pricing" element={<SmartPricingPage />} />
              <Route path="/bookings" element={<div className="p-6"><h1 className="text-2xl font-bold">Bookings</h1><p className="text-muted-foreground mt-2">Booking management content will go here.</p></div>} />
              <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground mt-2">Account and salon settings will go here.</p></div>} />
              <Route path="*" element={<Navigate to="/saloonUser/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
