"use client"

import { useActionsStore } from "@/lib/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, Clock, CheckCircle2, XCircle, Trash } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function ActionLog() {
  const { actionLogs, clearActionLogs } = useActionsStore()

  const getActionIcon = (action: string) => {
    switch (action) {
      case "view":
        return <Eye className="h-4 w-4 text-info" />
      case "edit":
        return <Pencil className="h-4 w-4 text-warning" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case "view":
        return "Ver"
      case "edit":
        return "Editar"
      case "delete":
        return "Eliminar"
      default:
        return action
    }
  }

  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
    } catch {
      return "hace un momento"
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Acciones Recientes</h3>
        </div>
        {actionLogs.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearActionLogs}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[300px]">
        {actionLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
            <Clock className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No hay acciones registradas</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {actionLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-md hover:bg-secondary/50 transition-colors"
              >
                <div className="mt-0.5">{getActionIcon(log.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {getActionText(log.action)}
                    </span>
                    {log.success ? (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    ) : (
                      <XCircle className="h-3 w-3 text-destructive" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {log.itemName}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {formatTime(log.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
