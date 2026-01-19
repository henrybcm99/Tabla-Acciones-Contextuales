"use client"

import { DataTable } from "@/components/data-table"
import { ActionLog } from "@/components/action-log"
import { RoleSelector } from "@/components/role-selector"
import { Toaster } from "@/components/ui/toaster"
import { Users, Table2, Activity } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Table2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Tabla de Acciones Contextuales</h1>
              <p className="text-sm text-muted-foreground">Gestión de usuarios con permisos por rol</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Table Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Usuarios</h2>
            </div>
            <DataTable />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <RoleSelector />
            
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-muted-foreground">Registro de Actividad</h2>
            </div>
            <ActionLog />
          </aside>
        </div>
      </main>

      <Toaster />
    </div>
  )
}
