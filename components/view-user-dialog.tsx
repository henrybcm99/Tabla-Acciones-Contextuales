"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@/lib/store"
import { Mail, Shield, Clock, CircleCheck, CircleX } from "lucide-react"

interface ViewUserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewUserDialog({ user, open, onOpenChange }: ViewUserDialogProps) {
  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Rol</p>
                <Badge variant="default" className="capitalize mt-1">
                  {user.role}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              {user.status === "active" ? (
                <CircleCheck className="h-5 w-5 text-success" />
              ) : (
                <CircleX className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <p className="text-sm font-medium">
                  {user.status === "active" ? "Activo" : "Inactivo"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Último acceso</p>
                <p className="text-sm font-medium">{user.lastLogin}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
