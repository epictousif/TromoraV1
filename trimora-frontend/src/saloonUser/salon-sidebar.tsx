import type * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Calendar,
  Home,
  Settings,
  Users,
  Scissors,
  Clock,
  Star,
  BarChart3,
  ImageIcon,
  MapPin,
  Bell,
  CreditCard,
  User,
  BadgePercent,
  DollarSign,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "./hooks/useAuth"

// Sample salon data
const salonData = {
  user: {
    name: "Salon Owner",
    email: "owner@beautysalon.com",
    avatar: "/placeholder.svg?height=32&width=32",
    salonName: "Beauty Paradise",
  },
}

// Navigation items for salon management
const navigationItems = [
  {
    title: "Dashboard",
    url: "/saloonUser/dashboard",
    icon: Home,
  },
  {
    title: "My Salons",
    url: "/saloonUser/salons",
    icon: Scissors,
  },
  {
    title: "Services",
    url: "/saloonUser/employee-services",
    icon: Star,
  },
  {
    title: "Appointments",
    url: "/salon/appointments",
    icon: Calendar,
  },
  {
    title: "Staff",
    url: "/saloonUser/employees",
    icon: Users,
  },
  {
    title: "Schedule",
    url: "/salon/schedule",
    icon: Clock,
  },
]

const businessItems = [
  {
    title: "Analytics",
    url: "/saloonUser/analytics",
    icon: BarChart3,
  },
  {
    title: "Gallery",
    url: "/saloonUser/gallery",
    icon: ImageIcon,
  },
  {
    title: "Deals",
    url: "/saloonUser/deals",
    icon: BadgePercent,
  },
  {
    title: "Smart Pricing",
    url: "/saloonUser/smart-pricing",
    icon: DollarSign,
  },
  {
    title: "Locations",
    url: "/saloonUser/locations",
    icon: MapPin,
  },
  {
    title: "Payments",
    url: "/saloonUser/payments",
    icon: CreditCard,
  },
]

const accountItems = [
  {
    title: "Profile",
    url: "/salon/profile",
    icon: User,
  },
  {
    title: "Notifications",
    url: "/salon/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/salon/settings",
    icon: Settings,
  },
]

export function SalonSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/saloonUser">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Scissors className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{salonData.user.salonName}</span>
                  <span className="truncate text-xs">Salon Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Business Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Business</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={(salonData.user.avatar) || "/placeholder.svg"} alt={salonData.user.name} />
                    <AvatarFallback className="rounded-lg">SO</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || salonData.user.name}</span>
                    <span className="truncate text-xs">{user?.email || salonData.user.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleLogout(); }}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
