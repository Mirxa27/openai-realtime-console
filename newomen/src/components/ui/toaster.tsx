'use client'

import { useEffect, useState } from 'react'
import * as Toast from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

interface ToastMessage {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info' | 'warning'
}

let toastId = 0
const toastList: ToastMessage[] = []
let addToast: ((toast: Omit<ToastMessage, 'id'>) => void) | null = null

export function toast(toast: Omit<ToastMessage, 'id'>) {
  if (addToast) {
    addToast(toast)
  }
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    addToast = (toast) => {
      const id = String(toastId++)
      const newToast = { ...toast, id }
      setToasts((prev) => [...prev, newToast])
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    }

    return () => {
      addToast = null
    }
  }, [])

  return (
    <Toast.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          className={clsx(
            'glass-card flex items-start gap-3 p-4 shadow-lg animate-in slide-in-from-right',
            {
              'border-green-500/20': toast.type === 'success',
              'border-red-500/20': toast.type === 'error',
              'border-blue-500/20': toast.type === 'info',
              'border-yellow-500/20': toast.type === 'warning',
            }
          )}
        >
          <div className="flex-1">
            <Toast.Title className="font-semibold text-white">
              {toast.title}
            </Toast.Title>
            {toast.description && (
              <Toast.Description className="mt-1 text-sm text-white/70">
                {toast.description}
              </Toast.Description>
            )}
          </div>
          <Toast.Action asChild altText="Close">
            <button className="text-white/50 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </Toast.Action>
        </Toast.Root>
      ))}
      <Toast.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm" />
    </Toast.Provider>
  )
}