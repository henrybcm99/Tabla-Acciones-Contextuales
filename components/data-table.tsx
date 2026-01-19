"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Pencil, Trash2, Search, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useActionsStore, type User, type ActionType } from "@/lib/store"
import { ViewUserDialog } from "@/components/view-user-dialog"
import { EditUserDialog } from "@/components/edit-user-dialog"
import { useToast } from "@/hooks/use-toast"

export function DataTable() {
  const { users, deleteUser, addActionLog, canPerformAction, currentUser } = useActionsStore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [userToView, setUserToView] = useState<User | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAction = (action: ActionType, user: User) => {
    // Validate empty data
    if (!user || !user.id) {
      toast({
        title: "Error",
        description: "Datos de usuario inválidos",
        variant: "destructive",
      })
      return
    }

    // Check permissions
    if (!canPerformAction(action)) {
      toast({
        title: "Acción no permitida",
        description: `Tu rol (${currentUser.role}) no tiene permisos para ${
          action === "view" ? "ver" : action === "edit" ? "editar" : "eliminar"
        } usuarios.`,
        variant: "destructive",
      })
      
      addActionLog({
        action,
        itemId: user.id,
        itemName: user.name,
        userId: currentUser.id,
        success: false,
      })
      return
    }

    switch (action) {
      case "view":
        setUserToView(user)
        setViewDialogOpen(true)
        addActionLog({
          action: "view",
          itemId: user.id,
          itemName: user.name,
          userId: currentUser.id,
          success: true,
        })
        break
      case "edit":
        setUserToEdit(user)
        setEditDialogOpen(true)
        break
      case "delete":
        setUserToDelete(user)
        setDeleteDialogOpen(true)
        break
    }
  }

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id)
      addActionLog({
        action: "delete",
        itemId: userToDelete.id,
        itemName: userToDelete.name,
        userId: currentUser.id,
        success: true,
      })
      toast({
        title: "Usuario eliminado",
        description: `${userToDelete.name} ha sido eliminado correctamente.`,
      })
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "editor":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-success/20 text-success" 
      : "bg-muted text-muted-foreground"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-secondary border-border"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredUsers.length} de {users.length} usuarios
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="font-semibold">Usuario</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Rol</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold">Último acceso</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-secondary/30 transition-colors">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem 
                          onClick={() => handleAction("view", user)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAction("edit", user)}
                          className="cursor-pointer"
                          disabled={!canPerformAction("edit")}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleAction("delete", user)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                          disabled={!canPerformAction("delete")}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              ¿Estás seguro de que deseas eliminar a <strong>{userToDelete?.name}</strong>? 
              Esta acción no se puede deshacer y se perderán todos los datos asociados a este usuario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View User Dialog */}
      <ViewUserDialog 
        user={userToView} 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen} 
      />

      {/* Edit User Dialog */}
      <EditUserDialog 
        user={userToEdit} 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
      />
    </div>
  )
}
