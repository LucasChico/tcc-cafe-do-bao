'use client';
import { useAuth } from "@/providers/auth.provider";

export const Header = () => {
    const { token } = useAuth();

    return (
        <header className="w-full bg-[#F2DB8D] px-[20px] py-[10px] flex justify-between items-center fixed top-0 left-0 z-[1000] shadow-md">
            <div className="flex text-lg font-bold before:content-['☕'] before:mr-3">Café do Bão</div>
            <div className="top-[0px] h-full flex h-[40px] w-full max-w-lg m-auto absolute self-end left-[50%] -translate-x-[50%]">
                <input type="text" placeholder="Pesquisar..." className="max-h-[42px] relative h-full w-full bg-[#fff] border-1 border-[#778249] rounded-lg relative placeholder-gray-3 py-1 pl-[10px] pr-[28px] top-[50%] translate-y-[-50%]" />
                <span className="relative max-h-[24px] top-[50%] translate-y-[-50%] right-[24px]">🔍</span>
            </div>
            {!token ? (
                <div className="auth-buttons">
                    <button className="button-transparent" onClick={() => window.location.href = ('login')}>Entrar</button>
                    <button className="button-transparent" onClick={() => window.location.href = ('register')}>Registrar</button>
                </div>
            ) : (
                <div className="auth-buttons"></div>
            )}
        </header>
    )
};