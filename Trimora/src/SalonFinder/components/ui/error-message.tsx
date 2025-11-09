"use client"

import { AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/SalonFinder/components/ui/alert"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
  className?: string
}

export function ErrorMessage({ message, onDismiss, className }: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className={cn("relative", className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="pr-8">{message}</AlertDescription>
      {onDismiss && (
        <Button variant="ghost" size="sm" className="absolute right-2 top-2 h-auto p-1" onClick={onDismiss}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  )
}
