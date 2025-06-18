
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "./components/AppLayout";
import ResponsiveContainer from "./components/ResponsiveContainer";
import AuthRequired from "./components/AuthRequired";

// Pages
import Login from "./pages/Login";
import Auth from "./pages/auth";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Users from "./pages/Users";
import Suppliers from "./pages/Suppliers";
import SupplierContacts from "./pages/SupplierContacts";
import Groups from "./pages/Groups";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import TransactionSection from "./components/events/TransactionSection";
import EntrySection from "./components/events/EntrySection";
import NewTransactionSection from "./components/events/NewTransactionSection";
import RacksPage from "./pages/Racks";
import BalancePage from "./pages/Balance";
import ShelfTypes from "./pages/ShelfTypes";
import Zones from "./pages/Zones";
import Tasks from "./pages/Tasks";
import LoadHistory from './pages/loadsHistory';

// Create proper pages for Entry and Transaction
const EntryPage = () => (
  <AuthRequired>
    <AppLayout>
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <h1 className="text-2xl font-bold mb-6">Entrada de Produtos</h1>
          <EntrySection />
        </motion.div>
      </ResponsiveContainer>
    </AppLayout>
  </AuthRequired>
);

const TransactionPage = () => (
  <AuthRequired>
    <AppLayout>
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold">Transação</h1>
            <p className="text-gray-500 mt-1">
              Registre a movimentação de itens do armazém
            </p>
          </header>
          <NewTransactionSection />
        </motion.div>
      </ResponsiveContainer>
    </AppLayout>
  </AuthRequired>
);

// Create QueryClient inside the component to ensure proper React context
const App = () => {
  // Create a client inside the component
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={
                  <AuthRequired>
                    <Dashboard />
                  </AuthRequired>
                } />
                <Route path="/items" element={
                  <AuthRequired>
                    <Items />
                  </AuthRequired>
                } />
                <Route path="/suppliers" element={
                  <AuthRequired>
                    <Suppliers />
                  </AuthRequired>
                } />
                <Route path="/supplier-contacts" element={
                  <AuthRequired>
                    <SupplierContacts />
                  </AuthRequired>
                } />
                <Route path="/groups" element={
                  <AuthRequired>
                    <Groups />
                  </AuthRequired>
                } />
                <Route path="/racks" element={
                  <AuthRequired>
                    <RacksPage />
                  </AuthRequired>
                } />
                <Route path="/users" element={
                  <AuthRequired>
                    <Users />
                  </AuthRequired>
                } />
                <Route path="/events" element={
                  <AuthRequired>
                    <Events />
                  </AuthRequired>
                } />
                <Route path="/load-history" element={
                  <AuthRequired>
                    <LoadHistory />
                  </AuthRequired>
                } />
                <Route path="/entry" element={<EntryPage />} />
                <Route path="/transaction" element={<TransactionPage />} />
                <Route path="/tasks" element={
                  <AuthRequired>
                    <Tasks />
                  </AuthRequired>
                } />
                <Route path="/load" element={
                  <AuthRequired>
                    <Tasks />
                  </AuthRequired>
                } />
                <Route path="/balance" element={
                  <AuthRequired>
                    <BalancePage />
                  </AuthRequired>
                } />
                <Route path="/shelf-types" element={
                  <AuthRequired>
                    <ShelfTypes />
                  </AuthRequired>
                } />
                <Route path="/zones" element={
                  <AuthRequired>
                    <Zones />
                  </AuthRequired>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
