import { Home, Calendar, Plus, User, Settings, History, LogOut } from "lucide-react"
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
  { title: "My Bookings", url: "/dashboard/customer/bookings", icon: Calendar },
  { title: "New Booking", url: "/booking/service/select", icon: Plus },
  { title: "Booking History", url: "/dashboard/customer/history", icon: History },
]

const accountItems = [
  { title: "Profile", url: "/dashboard/customer/profile", icon: User },
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

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "text-primary hover:bg-accent"

  const getUserInitials = () => {
    if (!user?.email) return "U"
    return user.email.charAt(0).toUpperCase()
  }

  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">{getUserInitials()}</AvatarFallback>
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
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/dashboard/customer"}
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium flex items-center gap-2" 
                          : "text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium flex items-center gap-2" 
                          : "text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="text-foreground hover:bg-accent hover:text-accent-foreground" tooltip="Sign Out">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
