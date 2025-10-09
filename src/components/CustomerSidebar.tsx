import { Home, Calendar, User, Settings, HelpCircle, LogOut } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigationItems = [
  { title: "Dashboard", url: "/dashboard/customer", icon: Home },
  { title: "Bookings", url: "/dashboard/customer/bookings", icon: Calendar },
  { title: "Profile", url: "/dashboard/customer/profile", icon: User },
  { title: "Support", url: "/dashboard/customer/support", icon: HelpCircle },
  { title: "Settings", url: "/dashboard/customer/settings", icon: Settings },
]

export function CustomerSidebar() {
  const { state } = useSidebar()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  const getUserInitials = () => {
    if (!user?.email) return "U"
    return user.email.charAt(0).toUpperCase()
  }

  const isCollapsed = state === "collapsed"

  return (
    <Sidebar 
      collapsible="icon" 
      className="!bg-white dark:!bg-gray-900 border-none shadow-[8px_0_24px_-8px_rgba(0,0,0,0.08)]"
    >
      <SidebarHeader className="border-none pb-6 pt-6">
        <div className="flex flex-col items-center gap-4 px-6">
          {!isCollapsed && (
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Shalean
              </h2>
              <p className="text-xs text-muted-foreground font-medium">Cleaning Services</p>
            </div>
          )}
          <div className="flex items-center gap-3 w-full">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold text-lg">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">
                  {user?.email?.split('@')[0] || 'Customer'}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/dashboard/customer"}
                      aria-label={item.title}
                      className={({ isActive }) => 
                        `flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-200 font-medium ${
                          isActive 
                            ? "!bg-primary !text-black shadow-[0_4px_16px_-4px_rgba(12,83,237,0.4)] scale-[1.02] translate-x-1" 
                            : "!text-black hover:!bg-gray-50 dark:hover:!bg-gray-800 hover:shadow-[0_2px_8px_-2px_rgba(12,83,237,0.15)] hover:scale-[1.01] hover:translate-x-1"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-none px-3 pb-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut}
              aria-label="Sign Out"
              className="!text-gray-700 dark:!text-gray-300 hover:!bg-red-50 dark:hover:!bg-red-950/30 hover:!text-red-600 dark:hover:!text-red-400 rounded-2xl px-4 py-3.5 transition-all duration-200 hover:scale-[1.01] hover:translate-x-1 font-medium" 
              tooltip="Sign Out"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
