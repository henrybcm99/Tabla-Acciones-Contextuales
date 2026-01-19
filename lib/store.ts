import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "admin" | "editor" | "viewer"

export type ActionType = "view" | "edit" | "delete"

export interface ActionLog {
  id: string
  action: ActionType
  itemId: string
  itemName: string
  timestamp: Date
  userId: string
  success: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: "active" | "inactive"
  lastLogin: string
  avatar?: string
}

interface ActionsStore {
  // Current user (for permission validation)
  currentUser: {
    id: string
    name: string
    role: UserRole
  }
  
  // Action logs
  actionLogs: ActionLog[]
  
  // Users data
  users: User[]
  
  // Actions
  addActionLog: (log: Omit<ActionLog, "id" | "timestamp">) => void
  clearActionLogs: () => void
  setCurrentUserRole: (role: UserRole) => void
  
  // CRUD for users
  addUser: (user: Omit<User, "id">) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  
  // Permission helpers
  canPerformAction: (action: ActionType) => boolean
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos@empresa.com",
    role: "admin",
    status: "active",
    lastLogin: "2026-01-19 10:30",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@empresa.com",
    role: "editor",
    status: "active",
    lastLogin: "2026-01-18 15:45",
  },
  {
    id: "3",
    name: "Juan López",
    email: "juan@empresa.com",
    role: "viewer",
    status: "inactive",
    lastLogin: "2026-01-15 09:20",
  },
  {
    id: "4",
    name: "Ana Rodríguez",
    email: "ana@empresa.com",
    role: "editor",
    status: "active",
    lastLogin: "2026-01-19 08:15",
  },
  {
    id: "5",
    name: "Pedro Sánchez",
    email: "pedro@empresa.com",
    role: "viewer",
    status: "active",
    lastLogin: "2026-01-17 14:00",
  },
]

// Permission matrix
const permissions: Record<UserRole, ActionType[]> = {
  admin: ["view", "edit", "delete"],
  editor: ["view", "edit"],
  viewer: ["view"],
}

export const useActionsStore = create<ActionsStore>()(
  persist(
    (set, get) => ({
      currentUser: {
        id: "current",
        name: "Usuario Actual",
        role: "admin",
      },
      
      actionLogs: [],
      
      users: initialUsers,
      
      addActionLog: (log) =>
        set((state) => ({
          actionLogs: [
            {
              ...log,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            },
            ...state.actionLogs,
          ].slice(0, 20), // Keep only last 20 actions
        })),
      
      clearActionLogs: () => set({ actionLogs: [] }),
      
      setCurrentUserRole: (role) =>
        set((state) => ({
          currentUser: { ...state.currentUser, role },
        })),
      
      addUser: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            { ...user, id: crypto.randomUUID() },
          ],
        })),
      
      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        })),
      
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
      
      canPerformAction: (action) => {
        const { currentUser } = get()
        return permissions[currentUser.role].includes(action)
      },
    }),
    {
      name: "actions-storage",
      partialize: (state) => ({
        actionLogs: state.actionLogs,
        currentUser: state.currentUser,
      }),
    }
  )
)
