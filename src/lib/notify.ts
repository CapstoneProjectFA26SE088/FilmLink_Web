import { toast as toastify, type ToastOptions } from "react-toastify"

/**
 * Universal Toast Notification Helper
 */
export const notify = {
  success: (message: string, options?: ToastOptions) => {
    return toastify.success(message, options)
  },

  error: (message: string, options?: ToastOptions) => {
    return toastify.error(message, options)
  },

  warning: (message: string, options?: ToastOptions) => {
    return toastify.warning(message, options)
  },

  info: (message: string, options?: ToastOptions) => {
    return toastify.info(message, options)
  },
}
