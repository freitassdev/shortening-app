"use client";

import { signIn } from "next-auth/react";
import { Input } from "../../components/shared/input";
import Button from "../../components/shared/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage({}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const router = useRouter()
  const onSubmit = async () => {
    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      callbackUrl: 'http://localhost:3000',
    });

    if (!res || !res.ok) {
      return toast.error("Erro ao fazer login.");
    }

    if (res.error) {
      return toast.error("Email ou senha incorretos!");
    }

    return router.replace("/"); //caso tenha algum erro
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <p>Login</p>
      <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <Input
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onSubmit}>Enviar</Button>
    </div>
  );
}
