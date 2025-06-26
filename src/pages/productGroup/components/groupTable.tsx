// components/GroupTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Power, PowerOff, ChevronRight, ChevronDown, Pencil } from "lucide-react";
import { IProductGroup } from "@/types/group";

interface GroupTableProps {
  groups: IProductGroup[];
  flatGroups: IProductGroup[] & { childrean?: IProductGroup[] };
  isVisible: (groupId: string) => boolean;
  expandedGroups: Record<string, boolean>;
  toggleExpanded: (groupId: string) => void;
  handleAddSubCategory: (group: IProductGroup) => void;
  handleEditGroup: (group: IProductGroup) => void;
  handleToggleActive: (group: IProductGroup) => void;
  hasChildrenMap: Record<string, boolean>;
}

export const GroupTable = ({
  flatGroups,
  isVisible,
  expandedGroups,
  toggleExpanded,
  handleAddSubCategory,
  handleEditGroup,
  handleToggleActive,
  hasChildrenMap,
}: GroupTableProps) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border mb-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Atualizado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flatGroups.map(group => {
            const isChild = !!group.parentId;
            const isExpanded = expandedGroups[group.id];
            const hasChildren = hasChildrenMap[group.id];

            return  (
              <TableRow key={group.id}>
                <TableCell>
                  <div className={`flex items-center ${isChild ? 'ml-6' : ''}`}>
                    {hasChildren && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleExpanded(group.id)}
                        className="mr-2"
                      >
                        {expandedGroups[group.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </Button>
                    )}
                    {group.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      group.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {group.active ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(group.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  {new Date(group.updatedAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAddSubCategory(group)}
                    title="Adicionar subcategoria"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditGroup(group)}
                    title="Editar categoria"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(group)}
                    title={group.active ? "Inativar categoria" : "Ativar categoria"}
                  >
                    {group.active ? (
                      <PowerOff className="h-4 w-4" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            )})}
        </TableBody>
      </Table>
    </div>
  );
};
