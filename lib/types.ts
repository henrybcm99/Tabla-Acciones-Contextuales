export type UserRole = "admin" | "editor" | "viewer"

export type ActionType = "view" | "edit" | "delete"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: "active" | "inactive"
  lastLogin: string
  avatar?: string
}

export interface ActionLog {
  id: string
  action: ActionType
  itemId: string
  itemName: string
  timestamp: Date
  userId: string
  success: boolean
}
