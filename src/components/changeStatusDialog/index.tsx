import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'activate' | 'inactivate';
  entityName?: string;
  onConfirm: () => void;
}

const ConfirmStatusDialog = ({
  open,
  onOpenChange,
  action,
  entityName,
  onConfirm,
}: ConfirmStatusDialogProps) => {
  const actionLabel = action === 'activate' ? 'Ativar' : 'Inativar';
  const entityLabel = entityName ? `o item "${entityName}"` : 'este item';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja <strong>{actionLabel.toLowerCase()}</strong> {entityLabel}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmStatusDialog;
