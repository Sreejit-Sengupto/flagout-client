import { toast } from "sonner"

export const showSuccess = (message: string) => {
    toast.success(message, { duration: 8000, position: 'top-center', style: { color: '#00FF00' } })
}

export const showInfo = (message: string) => {
    toast.info(message, { duration: 8000, position: 'top-center', style: { color: '#89CFF0' } })
}

export const showError = (message: string) => {
    toast.error(message, { duration: 8000, position: 'top-center', style: { color: '#D22B2B' } })
}

export const showWarning = (message: string) => {
    toast.warning(message, { duration: 8000, position: 'top-center', style: { color: '#D22B2B' } })
}