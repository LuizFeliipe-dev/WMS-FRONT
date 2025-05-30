import { useState } from 'react';
import AuthRequired from '../components/AuthRequired';
import Sidebar from '../components/Sidebar';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  FolderRoot, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const groupFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  code: z.string().min(2, { message: 'Código deve ter pelo menos 2 caracteres' }),
  description: z.string().optional(),
  parentId: z.string().optional(),
  zoneId: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

interface Group {
  id: string;
  name: string;
  code: string;
  description: string;
  parentId?: string;
  zoneId?: string;
  itemCount: number;
  children?: Group[];
}

interface Zone {
  id: string;
  name: string;
}

// Mock zones data
const zones: Zone[] = [
  { id: '1', name: 'Zona A - Recebimento' },
  { id: '2', name: 'Zona B - Expedição' },
  { id: '3', name: 'Zona C - Estoque' },
];

// Mock initial data
const initialGroups: Group[] = [
  {
    id: '1',
    name: 'Eletrônicos',
    code: 'ELE',
    description: 'Produtos eletrônicos como computadores, celulares e acessórios',
    itemCount: 38,
    children: [
      {
        id: '1.1',
        name: 'Computadores',
        code: 'ELE-COMP',
        description: 'Desktops e laptops',
        parentId: '1',
        itemCount: 15,
      },
      {
        id: '1.2',
        name: 'Celulares',
        code: 'ELE-CEL',
        description: 'Smartphones e acessórios',
        parentId: '1',
        itemCount: 23,
      }
    ]
  },
  {
    id: '2',
    name: 'Móveis',
    code: 'MOV',
    description: 'Mobiliário para escritório e residência',
    itemCount: 24,
  },
  {
    id: '3',
    name: 'Alimentos',
    code: 'ALI',
    description: 'Produtos alimentícios não perecíveis',
    itemCount: 56,
    zoneId: '3',
  },
  {
    id: '4',
    name: 'Acessórios',
    code: 'ACE',
    description: 'Acessórios diversos para computadores e outros dispositivos',
    itemCount: 42,
    children: [
      {
        id: '4.1',
        name: 'Mouses',
        code: 'ACE-MOU',
        description: 'Mouses e touchpads',
        parentId: '4',
        itemCount: 18,
      },
      {
        id: '4.2',
        name: 'Teclados',
        code: 'ACE-TEC',
        description: 'Teclados mecânicos e de membrana',
        parentId: '4',
        itemCount: 24,
      }
    ]
  },
];

// Helper function to get all groups in flat format
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

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      parentId: '',
      zoneId: '',
    },
  });

  const onSubmit = (data: GroupFormValues) => {
    if (editingGroup) {
      // Update existing group
      const updateNestedGroups = (groupsList: Group[]): Group[] => {
        return groupsList.map(group => {
          if (group.id === editingGroup.id) {
            return {
              ...group,
              name: data.name,
              code: data.code,
              description: data.description || '',
              parentId: data.parentId === 'none' ? undefined : data.parentId,
              zoneId: data.zoneId === 'none' ? undefined : data.zoneId,
            };
          } else if (group.children) {
            return {
              ...group,
              children: updateNestedGroups(group.children),
            };
          }
          return group;
        });
      };

      setGroups(updateNestedGroups(groups));

      toast({
        title: "Categoria atualizada",
        description: "As informações da categoria foram atualizadas com sucesso",
      });
    } else {
      // Add new group
      const newGroup: Group = {
        id: Date.now().toString(),
        name: data.name,
        code: data.code,
        description: data.description || '',
        parentId: data.parentId === 'none' ? undefined : data.parentId,
        zoneId: data.zoneId === 'none' ? undefined : data.zoneId,
        itemCount: 0,
      };

      if (data.parentId && data.parentId !== 'none') {
        // If parent is specified, add to children
        const updateParentWithNewChild = (groupsList: Group[]): Group[] => {
          return groupsList.map(group => {
            if (group.id === data.parentId) {
              return {
                ...group,
                children: [...(group.children || []), newGroup]
              };
            } else if (group.children) {
              return {
                ...group,
                children: updateParentWithNewChild(group.children)
              };
            }
            return group;
          });
        };

        setGroups(updateParentWithNewChild(groups));
      } else {
        // Add as top-level group
        setGroups([...groups, newGroup]);
      }

      toast({
        title: "Categoria adicionada",
        description: "Nova categoria foi adicionada com sucesso",
      });
    }

    setOpenDialog(false);
    form.reset();
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    form.reset({
      name: '',
      code: '',
      description: '',
      parentId: 'none',
      zoneId: 'none',
    });
    setOpenDialog(true);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    form.reset({
      name: group.name,
      code: group.code,
      description: group.description,
      parentId: group.parentId || 'none',
      zoneId: group.zoneId || 'none',
    });
    setOpenDialog(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    // Remove the group (and children) from the array
    const removeGroup = (groupsList: Group[]): Group[] => {
      return groupsList.filter(group => {
        if (group.id === groupId) {
          return false;
        } else if (group.children) {
          group.children = removeGroup(group.children);
        }
        return true;
      });
    };

    setGroups(removeGroup(groups));
    
    toast({
      title: "Categoria excluída",
      description: "A categoria foi removida com sucesso",
    });
  };

  const toggleExpanded = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const filteredGroups = searchTerm.length > 0 
    ? getAllGroups(groups).filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : groups;

  const getZoneName = (zoneId?: string) => {
    if (!zoneId) return '-';
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : '-';
  };

  // Recursive component for tree view
  const GroupRow = ({ group, level = 0, handleEditGroup, handleDeleteGroup, expandedGroups, toggleExpanded }) => {
    const hasChildren = group.children && group.children.length > 0;
    const isExpanded = expandedGroups[group.id] || false;
    const isMobile = useIsMobile();
    
    return (
      <>
        <TableRow key={group.id} className={level > 0 ? 'bg-gray-50' : ''}>
          <TableCell className="font-medium">
            <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
              {hasChildren ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 mr-1" 
                  onClick={() => toggleExpanded(group.id)}
                >
                  {isExpanded ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </Button>
              ) : (
                <span className="w-6"></span>
              )}
              {group.code}
            </div>
          </TableCell>
          <TableCell>{group.name}</TableCell>
          {!isMobile && <TableCell className="max-w-xs truncate">{group.description}</TableCell>}
          <TableCell>{getZoneName(group.zoneId)}</TableCell>
          <TableCell>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {group.itemCount}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end space-x-2">
              <Button 
                variant="icon" 
                onClick={() => handleEditGroup(group)}
                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="icon"
                onClick={() => handleDeleteGroup(group.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                title="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && (
          <>
            {group.children!.map((childGroup) => (
              <GroupRow 
                key={childGroup.id} 
                group={childGroup} 
                level={level + 1} 
                handleEditGroup={handleEditGroup}
                handleDeleteGroup={handleDeleteGroup}
                expandedGroups={expandedGroups}
                toggleExpanded={toggleExpanded}
              />
            ))}
          </>
        )}
      </>
    );
  };

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
            <header className="flex flex-wrap gap-4 justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <FolderRoot className="mr-3 h-6 w-6 text-primary" />
                  Cadastro de Categorias
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie as categorias de itens do sistema
                </p>
              </div>
              
              <Button onClick={handleAddGroup}>
                <Plus className="mr-2 h-5 w-5" />
                Nova Categoria
              </Button>
            </header>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
              <div className="p-4 border-b">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar categorias..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      {!isMobile && <TableHead>Descrição</TableHead>}
                      <TableHead>Zona</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchTerm.length > 0 ? (
                      // Flat list for search results
                      filteredGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">{group.code}</TableCell>
                          <TableCell>{group.name}</TableCell>
                          {!isMobile && <TableCell className="max-w-xs truncate">{group.description}</TableCell>}
                          <TableCell>{getZoneName(group.zoneId)}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {group.itemCount}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="icon"
                                onClick={() => handleEditGroup(group)}
                                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="icon"
                                onClick={() => handleDeleteGroup(group.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // Tree view for normal display
                      groups.map((group) => (
                        <GroupRow 
                          key={group.id} 
                          group={group} 
                          handleEditGroup={handleEditGroup} 
                          handleDeleteGroup={handleDeleteGroup}
                          expandedGroups={expandedGroups}
                          toggleExpanded={toggleExpanded}
                        />
                      ))
                    )}
                    {filteredGroups.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Nenhuma categoria encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 border-t flex flex-wrap justify-between items-center gap-3">
                <div className="text-sm text-gray-500">
                  Exibindo {filteredGroups.length} {searchTerm ? 'de ' + getAllGroups(groups).length : ''} categorias
                </div>
              </div>
            </div>
          </motion.div>
        </ResponsiveContainer>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              {editingGroup 
                ? 'Edite as informações da categoria abaixo.' 
                : 'Preencha os campos abaixo para adicionar uma nova categoria.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da categoria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="ELE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição da categoria" 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria Pai</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria pai (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma (categoria principal)</SelectItem>
                          {getAllGroups(groups)
                            .filter(g => g.id !== editingGroup?.id) // Can't make itself its own parent
                            .map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name} ({group.code})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="zoneId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zona</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma zona (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma</SelectItem>
                          {zones.map((zone) => (
                            <SelectItem key={zone.id} value={zone.id}>
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpenDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingGroup ? 'Salvar Alterações' : 'Cadastrar Categoria'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AuthRequired>
  );
};

export default Groups;
