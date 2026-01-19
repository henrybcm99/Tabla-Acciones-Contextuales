"use client"

import { useActionsStore, type UserRole } from "@/lib/store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function RoleSelector() {
  const { currentUser, setCurrentUserRole } = useActionsStore()

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-4 w-4 text-primary" />
      case "editor":
        return <Shield className="h-4 w-4 text-warning" />
      case "viewer":
        return <ShieldAlert className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRolePermissions = (role: UserRole) => {
    switch (role) {
      case "admin":
        return ["Ver", "Editar", "Eliminar"]
      case "editor":
        return ["Ver", "Editar"]
      case "viewer":
        return ["Ver"]
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Simular Rol de Usuario</h3>
      </div>
      
      <Select
        value={currentUser.role}
        onValueChange={(value: UserRole) => setCurrentUserRole(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              {getRoleIcon(currentUser.role)}
              <span className="capitalize">{currentUser.role}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Admin
            </div>
          </SelectItem>
          <SelectItem value="editor">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Editor
            </div>
          </SelectItem>
          <SelectItem value="viewer">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Viewer
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Permisos actuales:</p>
        <div className="flex flex-wrap gap-1">
          {getRolePermissions(currentUser.role).map((permission) => (
            <Badge key={permission} variant="secondary" className="text-xs">
              {permission}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
