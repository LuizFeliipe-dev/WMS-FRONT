
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthRequired from "./components/AuthRequired";

// Pages
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard/index";
import Users from "./pages/users";
import NotFound from "./pages/notFound";
import RacksPage from "./pages/rack";
import BalancePage from "./pages/balance";
import ShelfTypes from "./pages/shelfType";
import Zones from "./pages/zone";
import Tasks from "./pages/task";
import LoadHistory from './pages/loadsHistory';
import Login from './pages/auth/Login';
import Groups from './pages/productGroup';
import Suppliers from './pages/supplier';
import SupplierContacts from './pages/supplierContact';
import Product from './pages/product';
import { AuthProvider } from './contexts/AuthProvider';
import EntryPage from './pages/events/entry/entryPage';
import TransactionPage from './pages/events/transaction/transactionPage';
import { useState } from 'react';

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

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
                <Route path="/product" element={
                  <AuthRequired>
                    <Product />
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
                <Route path="/load-history" element={
                  <AuthRequired>
                    <LoadHistory />
                  </AuthRequired>
                } />
                <Route path="/entry" element={
                  <AuthRequired>
                    <EntryPage />
                  </AuthRequired>
                } />
                <Route path="/transaction" element={
                  <AuthRequired>
                    <TransactionPage />
                  </AuthRequired>}
                />
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
