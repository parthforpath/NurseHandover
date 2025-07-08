import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/welcome";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import Dashboard from "@/pages/dashboard";
import SearchPage from "@/pages/search";
import PatientDetails from "@/pages/patient-details";
import HandoversPage from "@/pages/handovers";
import Profile from "@/pages/profile";
import EditProfile from "@/pages/edit-profile";
import ChangePassword from "@/pages/change-password";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/welcome" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/" component={() => isAuthenticated ? <Dashboard /> : <Welcome />} />
      <Route path="/dashboard">
        <AuthenticatedRoute>
          <Dashboard />
        </AuthenticatedRoute>
      </Route>
      <Route path="/search">
        <AuthenticatedRoute>
          <SearchPage />
        </AuthenticatedRoute>
      </Route>
      <Route path="/patient/:id">
        <AuthenticatedRoute>
          <PatientDetails />
        </AuthenticatedRoute>
      </Route>
      <Route path="/handovers">
        <AuthenticatedRoute>
          <HandoversPage />
        </AuthenticatedRoute>
      </Route>
      <Route path="/profile">
        <AuthenticatedRoute>
          <Profile />
        </AuthenticatedRoute>
      </Route>
      <Route path="/edit-profile">
        <AuthenticatedRoute>
          <EditProfile />
        </AuthenticatedRoute>
      </Route>
      <Route path="/change-password">
        <AuthenticatedRoute>
          <ChangePassword />
        </AuthenticatedRoute>
      </Route>
      <Route path="/reports">
        <AuthenticatedRoute>
          <Reports />
        </AuthenticatedRoute>
      </Route>
      <Route path="/settings">
        <AuthenticatedRoute>
          <Settings />
        </AuthenticatedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
