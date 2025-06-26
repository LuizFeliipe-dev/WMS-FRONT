import { useEffect, useMemo, useState } from 'react';
import { groupService } from '@/services/groups';
import { useToast } from '@/hooks/use-toast';
import { IProductGroup } from '@/types/group';

type FormDialogState = {
  open: boolean;
  editingGroup?: IProductGroup | null;
  selectedParentId?: string | null;
};

type ConfirmDialogState = {
  open: boolean;
  group: IProductGroup | null;
};

export function useGroups(take = 10) {
  const { toast } = useToast();

  const [groups, setGroups] = useState<IProductGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [formDialog, setFormDialog] = useState<FormDialogState>({ open: false });
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ open: false, group: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);


  const fetchGroups = async () => {
    try {
      const res = await groupService.getAll({ page: currentPage, take: 10 });
      setGroups(res.data);
      setTotalPages(res.meta.totalPages);
    } catch (err) {
      toast({
        title: 'Erro ao buscar grupos',
        description: 'Não foi possível carregar os grupos',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchGroups();
    setExpandedGroups({});
  }, [currentPage]);

  const toggleExpanded = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const hasChildrenMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    groups.forEach(group => {
      if (group.parentId) {
        map[group.parentId] = true;
      }
    });
    return map;
  }, [groups]);

  const flatGroups = useMemo(() => {
    const topLevel = groups.filter(g => !g.parentId);
    const children = groups.filter(g => g.parentId);

    const result: IProductGroup[] = [];
    topLevel.forEach(parent => {
      result.push(parent);
      if (expandedGroups[parent.id]) {
        result.push(...children.filter(child => child.parentId === parent.id));
      }
    });

    return result;
  }, [groups, expandedGroups]);

  const handleAddSubCategory = (parent: IProductGroup) => {
    setFormDialog({
      open: true,
      editingGroup: null,
      selectedParentId: parent.id,
    });
  };

  const handleEditGroup = (group: IProductGroup) => {
    setFormDialog({
      open: true,
      editingGroup: group,
      selectedParentId: group.parentId,
    });
  };

  const handleCloseDialog = () => {
    setFormDialog({ open: false });
  };

  const handleSubmitGroup = async (data: {
    name: string;
    parentId?: string;
    zoneId?: string;
  }) => {
    try {
      let payload = {
        name: data.name,
        zoneId: data.zoneId === 'none' ? null : data.zoneId,
        active: true,
      };

      if (data.parentId) {
        payload = {...payload, parentId: data.parentId}
      }

      if (formDialog.editingGroup) {
        await groupService.update(formDialog.editingGroup.id, payload);
        toast({ title: 'Grupo atualizado com sucesso' });
      } else {
        await groupService.create(payload);
        toast({ title: 'Grupo criado com sucesso' });
      }

      setFormDialog({ open: false });
      fetchGroups();
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar grupo',
        description: err?.message || 'Erro inesperado.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = (group: IProductGroup) => {
    setConfirmDialog({ open: true, group });
  };

  const handleConfirmToggle = async (group: IProductGroup) => {
    try {
      if (group.active) {
        await groupService.inactivate(group.id);
        toast({ title: 'Grupo inativado com sucesso' });
      } else {
        await groupService.reactivate(group.id);
        toast({ title: 'Grupo ativado com sucesso' });
      }

      setConfirmDialog({ open: false, group: null });
      fetchGroups();
    } catch (err: any) {
      if (err.details === 'PRODUCT_GROUP_HAS_ACTIVE_PRODUCTS') {
        toast({
          title: 'Erro ao alterar status',
          description: 'O grupo possui produtos ativos e não pode ser inativado.',
          variant: 'destructive',
        });

        setConfirmDialog({ open: false, group: null });
        return;
      }

      toast({
        title: 'Erro ao alterar status',
        description: err?.message || 'Erro inesperado.',
        variant: 'destructive',
      });
    }
  };

  const isVisible = (group: IProductGroup): boolean => {
    if (!group.parentId) return true;
    return expandedGroups[group.parentId];
  };

  return {
    groups,
    flatGroups,
    expandedGroups,
    hasChildrenMap,
    toggleExpanded,
    handleAddSubCategory,
    handleEditGroup,
    handleToggleActive,
    handleCloseDialog,
    handleConfirmToggle,
    formDialog,
    confirmDialog,
    handleSubmitGroup,
    setFormDialog,
    setConfirmDialog,
    searchTerm,
    setSearchTerm,
    showActive,
    setShowActive,
    currentPage,
    setCurrentPage,
    totalPages,
    isLoading,
    isVisible,
  };
}
