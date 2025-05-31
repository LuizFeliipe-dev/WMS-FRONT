import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDown, 
  ArrowUp, 
  Package, 
  DollarSign,
  AlertTriangle,
  BarChart, 
  CalendarRange,
  Warehouse
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBalance } from '@/hooks/useBalance';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer as RechartsResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

const Balance = () => {
  const { 
    totalBalance, 
    entriesTotal, 
    departuresTotal, 
    adjustmentsCount,
    adjustmentsValue,
    recentTransactions, 
    topValueItems,
    warehouseData,
    warehouses,
    isLoading,
    error
  } = useBalance();
  
  const isMobile = useIsMobile();
  const [dateFilter, setDateFilter] = useState('month');
  const [warehouseFilter, setWarehouseFilter] = useState('all');

  // Filter warehouse data based on selected warehouse
  const filteredWarehouseData = warehouseFilter === 'all' 
    ? warehouseData 
    : warehouseData.filter(item => item.warehouseId === warehouseFilter);

  if (error) {
    console.error('Error loading balance data:', error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <ResponsiveContainer>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-transition"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Resumo de Saldo</h1>
              <p className="text-muted-foreground">
                Visão consolidada dos valores de estoque e movimentações
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Tabs defaultValue={dateFilter} onValueChange={setDateFilter} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-3 w-full md:w-auto">
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mês</TabsTrigger>
                  <TabsTrigger value="year">Ano</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Saldo Total em Estoque</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    `R$ ${totalBalance.toLocaleString('pt-BR')}`
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Valor total de todos os itens em estoque
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Entradas</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                  <ArrowDown className="mr-2 h-5 w-5 text-muted-foreground" />
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    `R$ ${entriesTotal.toLocaleString('pt-BR')}`
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Total de entradas no período
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Saídas</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                  <ArrowUp className="mr-2 h-5 w-5 text-muted-foreground" />
                  {isLoading ? (
                    <Skeleton className="h-8 w-32" />
                  ) : (
                    `R$ ${departuresTotal.toLocaleString('pt-BR')}`
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Total de saídas no período
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ajustes de Estoque</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-muted-foreground" />
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    adjustmentsCount
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <p className="text-xs text-muted-foreground mr-2">
                  Valor dos ajustes:
                </p>
                {isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span className="font-medium">
                    R$ {adjustmentsValue.toLocaleString('pt-BR')}
                  </span>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5" />
                  Itens de Maior Valor em Estoque
                </CardTitle>
                <CardDescription>
                  Top 10 itens com maior impacto financeiro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topValueItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            R$ {item.totalValue.toLocaleString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarRange className="mr-2 h-5 w-5" />
                  Movimentações Recentes
                </CardTitle>
                <CardDescription>
                  Últimas transações realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center">
                              {transaction.type === 'entry' ? (
                                <ArrowDown className="mr-1 h-4 w-4" />
                              ) : transaction.type === 'departure' ? (
                                <ArrowUp className="mr-1 h-4 w-4" />
                              ) : (
                                <AlertTriangle className="mr-1 h-4 w-4" />
                              )}
                              {transaction.type === 'entry' 
                                ? 'Entrada' 
                                : transaction.type === 'departure' 
                                ? 'Saída' 
                                : 'Ajuste'}
                            </span>
                          </TableCell>
                          <TableCell>{transaction.itemName}</TableCell>
                          <TableCell className="text-right">
                            R$ {transaction.value.toLocaleString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Entradas e Saídas por Mês (por Armazém)</CardTitle>
                <CardDescription>
                  Comparativo de valores de entrada e saída por mês
                </CardDescription>
              </div>
              <div className="w-full sm:w-64">
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Warehouse className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Todos os armazéns" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os armazéns</SelectItem>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      entrada: { label: "Entrada" },
                      saida: { label: "Saída" },
                    }}
                  >
                    <RechartsResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={filteredWarehouseData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 70,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis 
                          tickFormatter={(value) => 
                            `R$ ${value.toLocaleString('pt-BR')}`
                          }
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          formatter={(value: number) => [
                            `R$ ${value.toLocaleString('pt-BR')}`,
                            ""
                          ]}
                        />
                        <Legend />
                        <Bar dataKey="entrada" fill="#4f46e5" name="Entrada" />
                        <Bar dataKey="saida" fill="#f97316" name="Saída" />
                      </RechartsBarChart>
                    </RechartsResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </ResponsiveContainer>
    </div>
  );
};

export default Balance;
