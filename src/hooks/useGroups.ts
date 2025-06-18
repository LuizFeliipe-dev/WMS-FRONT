
import { useState, useEffect } from 'react';
import { Group } from '@/services/groups';
import { groupService } from '@/services/groups';
import { useToast } from './use-toast';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Fetch groups when component loads or filters change
  useEffect(() => {
    fetchGroups();
  }, [currentPage, showActive]);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const params = {
        take: 10,
        page: currentPage,
        active: showActive
      };
      const res = await groupService.getAll(params);
      setGroups(res);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast({
        title: "Erro ao carregar categorias",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply search filter locally
  useEffect(() => {
    let results = groups;

    // Apply search filter
    if (searchTerm) {
      const getAllGroups = (groups: Group[]): Group[] => {
        let allGroups: Group[] = [];
        groups.forEach(group => {
          allGroups.push(group);
          if (group.children && group.children.length > 0) {
            allGroups = [...allGroups, ...group.children];
          }
        });
        return allGroups;
      };

      const allGroups = getAllGroups(results);
      results = allGroups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredGroups(results);
  }, [groups, searchTerm]);

  const handleAddGroup = () => {
    setEditingGroup(null);
    setOpenDialog(true);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setOpenDialog(true);
  };

  const handleDeleteGroup = async (groupId: string) => {
    console.log('Delete group:', groupId);
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A exclusão de categorias será implementada em breve",
      variant: "destructive",
    });
  };

  const handleShowActiveChange = (value: boolean) => {
    setShowActive(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleToggleActiveGroup = async (group: Group) => {
    try {
      if (group.active) {
        await groupService.inactivate(group.id);
        toast({
          title: "Categoria inativada",
          description: "A categoria foi inativada com sucesso",
        });
      } else {
        await groupService.reactivate(group.id);
        toast({
          title: "Categoria ativada",
          description: "A categoria foi ativada com sucesso",
        });
      }

      await fetchGroups();
    } catch (error) {

    }
  };

  const toggleExpanded = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const onSubmitGroup = async (data: any) => {
    try {
      const groupData = {
        name: data.name,
        parentId: data.parentId === 'none' ? undefined : data.parentId,
        zoneId: data.zoneId === 'none' ? undefined : data.zoneId,
        active: true
      };

      if (editingGroup) {
        await groupService.update(editingGroup.id, groupData);
        toast({
          title: "Categoria atualizada",
          description: "As informações da categoria foram atualizadas com sucesso",
        });
      } else {
        await groupService.create(groupData);
        toast({
          title: "Categoria adicionada",
          description: "Nova categoria foi adicionada com sucesso",
        });
      }

      setOpenDialog(false);
      await fetchGroups(); // Reload the list
    } catch (error) {
      console.error('Error saving group:', error);
      toast({
        title: "Erro ao salvar categoria",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  return {
    groups,
    filteredGroups,
    isLoading,
    searchTerm,
    setSearchTerm,
    showActive,
    setShowActive: handleShowActiveChange,
    currentPage,
    setCurrentPage,
    openDialog,
    setOpenDialog,
    editingGroup,
    setEditingGroup,
    expandedGroups,
    handleAddGroup,
    handleEditGroup,
    handleDeleteGroup,
    handleToggleActiveGroup,
    toggleExpanded,
    onSubmitGroup,
    setGroups
  };
};
