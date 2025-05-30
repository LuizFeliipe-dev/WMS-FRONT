
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EntrySection from '@/components/events/EntrySection';
import InventorySection from '@/components/events/InventorySection';
import TransactionSection from '@/components/events/TransactionSection';

const Events = () => {
  return (
    <AuthRequired>
      <div className="min-h-screen flex flex-col">
        <Sidebar />
        <ResponsiveContainer>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="page-transition"
          >
            <header className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold">Eventos</h1>
              <p className="text-gray-500 mt-1">
                Gerencie entradas, inventários e transações de itens do armazém
              </p>
            </header>

            <Card className="mb-6 md:mb-8">
              <CardHeader>
                <CardTitle>Visão Geral de Processos</CardTitle>
                <CardDescription>
                  Selecione um processo para gerenciar eventos de estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="entry" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="entry">Entrada</TabsTrigger>
                    <TabsTrigger value="inventory">Inventário</TabsTrigger>
                    <TabsTrigger value="transaction">Transação</TabsTrigger>
                  </TabsList>
                  <TabsContent value="entry" className="mt-0">
                    <EntrySection />
                  </TabsContent>
                  <TabsContent value="inventory" className="mt-0">
                    <InventorySection />
                  </TabsContent>
                  <TabsContent value="transaction" className="mt-0">
                    <TransactionSection />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </ResponsiveContainer>
      </div>
    </AuthRequired>
  );
};

export default Events;
