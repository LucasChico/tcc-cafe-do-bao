'use client';
import { useAuth } from "@/providers/auth.provider";
import Link from "next/link";

const LoginScreen = () => {
    const { login } = useAuth();


    const handleLogin = (e) => {
        e.preventDefault();
        const [usuario, senha] = e.target.elements;
        login(usuario.value, senha.value);
    }

    return (
        <div className="main-content neumorphic login-container">
            <h2>Login</h2>
            <form className="form" onSubmit={handleLogin}>
                <input type="text" placeholder="Usuario" required />
                <input type="password" placeholder="Senha" required />
                <button className="button-default" type="submit">Entrar</button>
                <p>Não tem uma conta? <Link className="link" href="/register" onClick={() => (console.log(''))}>Registre-se</Link></p>
            </form>
        </div>
    );
}

export default LoginScreen;