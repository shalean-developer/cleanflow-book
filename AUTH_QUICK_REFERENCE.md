# Auth System - Quick Reference

## 🚀 Quick Start

### 1. Using Auth in Components

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, loading, isAdmin, isCleaner, isCustomer } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      {isAdmin && <AdminPanel />}
      {isCleaner && <CleanerPanel />}
    </div>
  );
}
```

### 2. Protecting Routes

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

// Any authenticated user
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

// Admin only
<Route path="/admin" element={
  <ProtectedRoute requireAdmin>
    <AdminPanel />
  </ProtectedRoute>
} />

// Cleaner only
<Route path="/cleaner" element={
  <ProtectedRoute requireCleaner>
    <CleanerDashboard />
  </ProtectedRoute>
} />
```

### 3. Loading Profile Data

```tsx
import { useProfile } from '@/hooks/useProfile';

function ProfilePage() {
  const { profile, loading } = useProfile();

  if (loading) return <Spinner />;

  return (
    <div>
      <img src={profile?.avatar_url} alt="Avatar" />
      <h1>{profile?.full_name}</h1>
      <p>{profile?.role}</p>
    </div>
  );
}
```

## 🔑 Auth Methods

```tsx
const { signIn, signUp, signOut, signInWithMagicLink } = useAuth();

// Email/Password Sign In
await signIn('user@example.com', 'password123');

// Sign Up
await signUp('user@example.com', 'password123');

// Magic Link
await signInWithMagicLink('user@example.com');

// Sign Out
await signOut();
```

## 🛡️ Role Checking

```tsx
const { isAdmin, isCleaner, isCustomer, userRole } = useAuth();

// Boolean checks
if (isAdmin) {
  // Show admin features
}

// Direct role access
switch (userRole) {
  case 'admin':
    return <AdminDashboard />;
  case 'cleaner':
    return <CleanerDashboard />;
  case 'customer':
    return <CustomerDashboard />;
}
```

## 📊 Auth State Properties

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current authenticated user |
| `session` | `Session \| null` | Current session object |
| `loading` | `boolean` | True while auth is initializing |
| `profile` | `UserProfile \| null` | User profile data |
| `userRole` | `UserRole \| null` | User's role (customer/admin/cleaner) |
| `isAdmin` | `boolean` | True if user is admin |
| `isCleaner` | `boolean` | True if user is cleaner |
| `isCustomer` | `boolean` | True if user is customer |

## 🎯 Common Patterns

### Pattern 1: Conditional Rendering

```tsx
function Dashboard() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  return (
    <div>
      <h1>Dashboard</h1>
      {isAdmin && <AdminSection />}
    </div>
  );
}
```

### Pattern 2: Role-Based Navigation

```tsx
function Navigation() {
  const { user, isAdmin, isCleaner } = useAuth();

  return (
    <nav>
      {user && <Link to="/dashboard">Dashboard</Link>}
      {isAdmin && <Link to="/admin">Admin</Link>}
      {isCleaner && <Link to="/cleaner">Cleaner</Link>}
    </nav>
  );
}
```

### Pattern 3: Automatic Redirects

```tsx
function HomePage() {
  const { user, isAdmin, isCleaner, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    
    if (isAdmin) {
      navigate('/dashboard/admin');
    } else if (isCleaner) {
      navigate('/dashboard/cleaner');
    } else if (user) {
      navigate('/dashboard');
    }
  }, [user, isAdmin, isCleaner, loading]);

  return <LandingPage />;
}
```

## ⚡ Performance Tips

1. **Use `loading` state** - Always check loading before rendering
2. **Memoize expensive computations** - Use `useMemo` for complex role logic
3. **Avoid unnecessary re-renders** - Profile data loads separately from auth
4. **Use ProtectedRoute** - Better than manual checks in every component

## 🐛 Common Issues

### Issue: Loading never ends
**Solution:** Check browser console for errors. Clear localStorage and try again.

```javascript
localStorage.clear();
location.reload();
```

### Issue: User is null after refresh
**Solution:** Check Supabase configuration and ensure cookies are enabled.

### Issue: Role not detected
**Solution:** Verify user has a role in the database.

```sql
-- Check user role
SELECT * FROM user_roles WHERE user_id = '<user-id>';
SELECT * FROM profiles WHERE id = '<user-id>';
```

## 🔄 Migration from Old Auth

If you're migrating from an old auth pattern:

### Old Way ❌
```tsx
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setUser(data.session?.user);
    setLoading(false);
  });
}, []);
```

### New Way ✅
```tsx
import { useAuth } from '@/hooks/useAuth';

const { user, loading } = useAuth();
// That's it! Loading is guaranteed to end within 2s
```

## 📝 TypeScript Types

```typescript
import type { User, Session } from '@supabase/supabase-js';
import type { Tables } from '@/integrations/supabase/types';

type UserProfile = Tables<'profiles'>;
type UserRole = 'customer' | 'admin' | 'cleaner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  userRole: UserRole | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  isCleaner: boolean;
  isCustomer: boolean;
}
```

## 🎨 UI Examples

### Loading State
```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
```

### Login Required
```tsx
if (!user) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-muted-foreground mb-4">Please login to continue</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    </div>
  );
}
```

### Access Denied
```tsx
if (!isAdmin) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
      </div>
    </div>
  );
}
```

## 🚀 Best Practices

1. ✅ Always check `loading` before checking `user`
2. ✅ Use `ProtectedRoute` for entire pages
3. ✅ Use `useAuth` hooks for specific checks
4. ✅ Use `useProfile` for non-critical profile data
5. ✅ Handle loading states gracefully
6. ✅ Provide clear error messages
7. ✅ Test role-based access thoroughly
8. ✅ Clear localStorage on logout
9. ✅ Use TypeScript types for safety
10. ✅ Keep auth logic in context, not components

## 📚 Further Reading

- [Full Implementation Guide](./AUTH_RESTORATION_IMPLEMENTATION.md)
- [Database Migration](./AUTH_SESSION_REFRESH_FIX_MIGRATION.sql)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)

