"use client";

import { MoreVertical, Pencil, UserRoundX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EntityActionsMenuProps {
  onEdit?: () => void;
  onSetInactive?: () => void;
  onDelete?: () => void;
}

export function EntityActionsMenu({
  onEdit,
  onSetInactive,
  onDelete,
}: EntityActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Más opciones"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil className="h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onSetInactive}>
          <UserRoundX className="h-4 w-4" />
          <span>Marcar como inactivo</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span>Eliminar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
