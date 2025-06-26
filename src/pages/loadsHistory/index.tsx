"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Loader2, Package } from "lucide-react"
import { useLoads } from "@/hooks/useLoads"
import AppLayout from "@/components/AppLayout"
import ResponsiveContainer from '@/components/ResponsiveContainer'

const LoadHistory = () => {
  const { loads, isLoading, meta } = useLoads()
  const isMobile = useIsMobile()
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Received":
        return {
          bg: "bg-green-100 hover:bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        }
      case "Pending":
        return {
          bg: "bg-yellow-100 hover:bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        }
      default:
        return {
          bg: "bg-gray-100 hover:bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        }
    }
  }

  return (
    <AppLayout>
      <ResponsiveContainer>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="page-transition">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Histórico de Cargas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead>Documento de entrada</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      {!isMobile && <TableHead>Status</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 3 : 4} className="text-center py-8">
                          <div className="flex justify-center items-center">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>Carregando cargas...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : loads?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 3 : 4} className="text-center py-6 text-muted-foreground">
                          Nenhuma carga encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      loads?.map((load) => (
                        <>
                          <TableRow
                            key={load.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => toggleRow(load.id)}
                          >
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                {expandedRows[load.id] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-medium">{load.documentNumber}</TableCell>
                            <TableCell>{load.supplier?.name || "Não definido"}</TableCell>
                            {!isMobile && (
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`${getStatusBadgeVariant(load.status).bg} ${getStatusBadgeVariant(load.status).text} ${getStatusBadgeVariant(load.status).border}`}
                                >
                                  {load.status}
                                </Badge>
                              </TableCell>
                            )}
                          </TableRow>
                          <AnimatePresence>
                            {expandedRows[load.id] && (
                              <TableRow key={`${load.id}-expanded`}>
                                <TableCell colSpan={isMobile ? 3 : 4} className="p-0">
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="bg-muted/50 p-4">
                                      <h4 className="text-sm font-medium mb-2 flex items-center">
                                        <Package className="h-4 w-4 mr-2" />
                                        Pacotes ({load.package?.length || 0})
                                      </h4>

                                      {load.package?.length > 0 ? (
                                        <div className="space-y-4">
                                          {load.package.map((pkg, index) => (
                                            <div key={pkg.id} className="bg-background rounded-md p-3 shadow-sm">
                                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                <div>
                                                  <p className="text-xs text-muted-foreground">Produto</p>
                                                  <p className="text-sm font-medium">{pkg.product?.name}</p>
                                                </div>
                                                <div>
                                                  <p className="text-xs text-muted-foreground">Tipo</p>
                                                  <p className="text-sm font-medium">{pkg.packageType}</p>
                                                </div>
                                                <div>
                                                  <p className="text-xs text-muted-foreground">Quantidade</p>
                                                  <p className="text-sm font-medium">{pkg.quantity}</p>
                                                </div>
                                                <div>
                                                  <p className="text-xs text-muted-foreground">Dimensões (A×L×C)</p>
                                                  <p className="text-sm font-medium">
                                                    {pkg.height} × {pkg.width} × {pkg.length}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="text-xs text-muted-foreground">Peso</p>
                                                  <p className="text-sm font-medium">{pkg.weight} kg</p>
                                                </div>
                                              </div>
                                              {pkg.product?.description && (
                                                <div className="mt-2">
                                                  <p className="text-xs text-muted-foreground">Descrição</p>
                                                  <p className="text-sm">{pkg.product.description}</p>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">Nenhum pacote encontrado.</p>
                                      )}
                                    </div>
                                  </motion.div>
                                </TableCell>
                              </TableRow>
                            )}
                          </AnimatePresence>
                        </>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {meta && (
                <div className="flex items-center justify-center py-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < meta.totalPages && setCurrentPage(currentPage + 1)}
                          className={
                            currentPage >= meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </ResponsiveContainer>
    </AppLayout>
  )
}

export default LoadHistory
