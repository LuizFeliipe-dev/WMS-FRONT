
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Users from "./pages/Users";
import Suppliers from "./pages/Suppliers";
import Warehouses from "./pages/Warehouses";
import Groups from "./pages/Groups";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import TransactionSection from "./components/events/TransactionSection";
import EntrySection from "./components/events/EntrySection";
import InventorySection from "./components/events/InventorySection";
import Stats3DView from "./components/Stats3DView";
import LocationsPage from "./pages/Locations";
import RacksPage from "./pages/Racks";
import BalancePage from "./pages/Balance";
import ShelfTypes from "./pages/ShelfTypes";
import Zones from "./pages/Zones";
import Tasks from "./pages/Tasks";

// Create proper pages for Entry, Inventory, and Location View
const EntryPage = () => (
  <div className="min-h-screen flex">
    <Sidebar />
    <main className="flex-1 ml-64 p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-transition"
      >
        <h1 className="text-2xl font-bold mb-6">Entrada de Produtos</h1>
        <EntrySection />
      </motion.div>
    </main>
  </div>
);

const InventoryPage = () => (
  <div className="min-h-screen flex">
    <Sidebar />
    <main className="flex-1 ml-64 p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-transition"
      >
        <h1 className="text-2xl font-bold mb-6">Inventário</h1>
        <InventorySection />
      </motion.div>
    </main>
  </div>
);

const TransactionPage = () => (
  <div className="min-h-screen flex">
    <Sidebar />
    <main className="flex-1 ml-64 p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-transition"
      >
        <h1 className="text-2xl font-bold mb-6">Transação de Produtos</h1>
        <TransactionSection />
      </motion.div>
    </main>
  </div>
);

// Create a dedicated page for 3D visualization
const LocationViewPage = () => (
  <div className="min-h-screen flex">
    <Sidebar />
    <main className="flex-1 ml-64 p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-transition"
      >
        <h1 className="text-2xl font-bold mb-6">Visualização 3D do Armazém</h1>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden h-[calc(100vh-180px)]">
          <Stats3DView />
        </div>
      </motion.div>
    </main>
  </div>
);

const StatisticsPage = () => <div className="p-8 ml-64"><h1 className="text-2xl font-bold">Estatísticas</h1><p className="mt-4">Página em desenvolvimento</p></div>;

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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/items" element={<Items />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/warehouses" element={<Warehouses />} />
                <Route path="/locations" element={<LocationsPage />} />
                <Route path="/racks" element={<RacksPage />} />
                <Route path="/users" element={<Users />} />
                <Route path="/events" element={<Events />} />
                <Route path="/entry" element={<EntryPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/transaction" element={<TransactionPage />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/location-view" element={<LocationViewPage />} />
                <Route path="/balance" element={<BalancePage />} />
                <Route path="/shelf-types" element={<ShelfTypes />} />
                <Route path="/zones" element={<Zones />} />
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
