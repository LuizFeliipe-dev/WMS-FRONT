
import { useState, useEffect } from 'react';
import { Group } from '@/services/groups';
import { groupService } from '@/services/groups';
import { useToast } from './use-toast';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Fetch groups when component loads
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const data = await groupService.getAll();
      setGroups(data);
      setFilteredGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast({
        title: "Erro ao carregar categorias",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      setGroups([]);
      setFilteredGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply search filter
  useEffect(() => {
    let results = groups;
    
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

      const allGroups = getAllGroups(groups);
      results = allGroups.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
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
        code: data.code,
        description: data.description || '',
        parentId: data.parentId === 'none' ? undefined : data.parentId,
        zoneId: data.zoneId === 'none' ? undefined : data.zoneId,
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
    openDialog,
    setOpenDialog,
    editingGroup,
    expandedGroups,
    handleAddGroup,
    handleEditGroup,
    handleDeleteGroup,
    toggleExpanded,
    onSubmitGroup,
    setGroups
  };
};
