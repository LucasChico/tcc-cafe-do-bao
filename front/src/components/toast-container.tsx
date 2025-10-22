'use client';
import { useToast } from "@/providers/toast.provider";
import { Toast } from "./toast";

export const ToastContainer = () => {
    const { toasts } = useToast();
    return (
        <div className="toast-container">
            {toasts.map((toast) => <Toast key={toast.id} {...toast} />)}
        </div>
    );
}