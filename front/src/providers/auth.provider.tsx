"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./toast.provider";
import { decode } from "jsonwebtoken";

const authContext = createContext({
  login: (usuario, senha) => {},
  logout: () => {},
  token: null,
  idCliente: () => {},
});

export const useAuth = () => {
  return useContext(authContext);
};

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();
  const localStorage =
    typeof window !== "undefined"
      ? window.localStorage
      : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loginOrHome =
      window.location.pathname === "/login" ||
      window.location.pathname === "/register";

    if (!token && !loginOrHome) {
      window.location.pathname = "/login";
      return;
    }

    setToken(token);
    if (loginOrHome && !!token) {
      window.location.href = "/home";
    }
  }, [token]);

  const idCliente = () => {
    const { id } = decode(token) as { id: number };

    return id;
  };

  const login = async (usuario, senha) => {
    const response = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, senha }),
    });

    if (response.ok) {
      const cliente = await response.json();
      setToken(cliente.token);
      localStorage.setItem("token", cliente.token);
      return;
    }

    const message = await response.json();
    addToast(message.message, "error");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <authContext.Provider value={{ login, logout, token, idCliente }}>
      {children}
    </authContext.Provider>
  );
};
