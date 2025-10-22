'use client';
import { createContext, useContext, useEffect, useState } from "react";

const toastContext = createContext({
    toasts: [],
    setToasts: (s) => { },
    addToast: (message, type) => { },
    removeToast: (s) => { },
});

export const useToast = () => {
    return useContext(toastContext);
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const addToast = (message, type) => {
        console.log('addToast', message, type);
        setToasts([...toasts, { id: Date.now(), message, type }]);
    }

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    }

    useEffect(() => {
        const fadeOut = (id) => {
            const toast = document.getElementById(id);
            if (toast) {
                toast.style.opacity = '0';
                setTimeout(() => {
                    removeToast(id);
                }, 200);
            }
        }
        if (toasts.length > 0) {
            const timer = setTimeout(() => {
                fadeOut(toasts[0].id);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toasts]);

    return (
        <toastContext.Provider value={{ toasts, setToasts, addToast, removeToast }}>{children}</toastContext.Provider>
    );
}

