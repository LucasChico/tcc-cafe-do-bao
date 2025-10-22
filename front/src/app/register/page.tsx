'use client';
import { useToast } from "@/providers/toast.provider";
import Link from "next/link";

const RegisterScreen = () => {
    const { addToast } = useToast();

    const handleRegister = async (e) => {
        e.preventDefault();
        const [nome, usuario, dataDeNascimento, documento, senha, confirmarSenha] = e.target.elements;

        console.log(senha.value, confirmarSenha.value);
        if (senha.value !== confirmarSenha.value) {
            addToast('As senhas não coincidem', 'error');
            return;
        }

        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: nome.value, usuario: usuario.value, dataDeNascimento: dataDeNascimento.value, documento: documento.value, senha: senha.value }),
        });

        if (response.ok) {
            addToast('Registro realizado com sucesso!', 'success');
            window.location.href = '/login';
            return
        }

        const message = await response.json();
        addToast(message.message, 'error');
    }

    return (
        <div className="main-content neumorphic login-container">
            <h2>Registro</h2>
            <form className="form" onSubmit={handleRegister}>
                <input type="text" placeholder="Nome" required />
                <input type="text" placeholder="Usuario" required />
                <input type="date" placeholder="Data de Nascimento" required />
                <input type="text" placeholder="Documento" required />
                <input type="password" placeholder="Senha" required />
                <input type="password" placeholder="Confirmar Senha" required />
                <button className="button-default" type="submit">Registrar</button>
                <button className="button-cancel" onClick={() => {
                    window.location.href = '/login';
                }}>Voltar</button>
            </form>
        </div>
    );
}

export default RegisterScreen;