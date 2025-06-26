import { useState, useEffect, useCallback } from 'react';
import { IProduct, ProductFormValues } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { groupService } from '@/services/groups';
import { productService } from '@/services/product';

export let groups: { id: string; name: string }[] = [];

export const useProducts = (take: number = 10) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormValues | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProductGroups();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filterGroup, showActive, currentPage]);

  const loadProductGroups = async () => {
    try {
      setIsLoading(true);
      const groupsData = await groupService.getAll();
      groups.length = 0;
      groups.push(...groupsData.data.map(g => ({ id: g.id, name: g.name })));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar categorias.",
        variant: "destructive"
      });
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params = {
        take,
        page: currentPage,
        active: showActive,
        ...(searchTerm && { name: searchTerm }),
        ...(filterGroup && filterGroup !== 'all' && { groupId: filterGroup })
      };

      const { data, meta } = await productService.getAll(params);
      setProducts(data);
      setTotalPages(meta?.totalPages || 1);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar produtos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setOpenDialog(true);
  };

  const handleEditProduct = (product: IProduct) => {
    const itemForm: ProductFormValues = {
      id: product.id,
      name: product.name,
      description: product.description,
      measurementUnit: product.measurementUnit,
      productGroupId: product.productGroupId,
      active: product.active,
    };

    setEditingProduct(itemForm);
    setOpenDialog(true);
  };

  const onSubmitProduct = useCallback(async (data: ProductFormValues) => {
    try {
      const productData = {
        name: data.name,
        description: data.description,
        measurementUnit: data.measurementUnit,
        productGroupId: data.productGroupId,
        active: data.active
      };

      if (data.id) {
        await productService.update(data.id, productData);
        toast({ title: "Sucesso", description: "Produto atualizado com sucesso." });
      } else {
        await productService.create(productData);
        toast({ title: "Sucesso", description: "Produto criado com sucesso." });
      }

      await fetchProducts();
      setOpenDialog(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar produto.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleToggleProductStatus = (product: IProduct) => {
    setSelectedProduct(product);
    setStatusDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedProduct) return;

    try {
      if (selectedProduct.active) {
        await productService.inactivate(selectedProduct.id);
      } else {
        await productService.reactivate(selectedProduct.id);
      }

      toast({
        title: selectedProduct.active ? "Produto inativado" : "Produto ativado",
        description: `O produto ${selectedProduct.name} foi ${selectedProduct.active ? "inativado" : "ativado"} com sucesso.`
      });

      await fetchProducts();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do produto.",
        variant: "destructive"
      });
    } finally {
      setStatusDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  return {
    products,
    groups,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterGroup,
    setFilterGroup,
    showActive,
    setShowActive,
    currentPage,
    setCurrentPage,
    totalPages,
    openDialog,
    setOpenDialog,
    editingProduct,
    handleAddProduct,
    handleEditProduct,
    onSubmitProduct,
    handleToggleProductStatus,
    confirmToggleStatus,
    statusDialogOpen,
    setStatusDialogOpen,
    selectedProduct,
    setSelectedProduct
  };
};
