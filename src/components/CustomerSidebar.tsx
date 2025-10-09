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

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "text-primary hover:bg-accent"

  const getUserInitials = () => {
    if (!user?.email) return "U"
    return user.email.charAt(0).toUpperCase()
  }

  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-4">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-sidebar-foreground truncate">
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
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/dashboard/customer"}
                      className={({ isActive }) => 
                        `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                          isActive 
                            ? "bg-primary text-primary-foreground font-semibold shadow-md scale-[1.02]" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut} 
              className="text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg px-3 py-2 transition-all duration-200 hover:translate-x-1" 
              tooltip="Sign Out"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
