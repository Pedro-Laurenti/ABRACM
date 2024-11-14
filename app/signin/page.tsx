"use client";
import { useState, useMemo, useEffect } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Link,
  Divider,
  Input,
} from "@nextui-org/react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastLoginTime] = useState<number | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lastLoginTime && Date.now() - lastLoginTime < 60000) {
      setError("Aguarde 1 minuto para tentar novamente.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Erro no servidor");
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Erro de conexão:", error);
      setError("Erro ao conectar-se ao servidor");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const isInvalidEmail = useMemo(() => {
    return (
      email !== "" && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
    );
  }, [email]);

  return (
    <div className="flex items-center justify-center">
      <Card className="min-w-96">
        <CardBody>
          <CardHeader>
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          </CardHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Input
              type="email"
              value={email}
              isInvalid={isInvalidEmail}
              color={isInvalidEmail ? "danger" : "default"}
              errorMessage="Use um endereço de e-mail válido"
              onChange={(e) => setEmail(e.target.value)}
              variant="bordered"
              label="Email"
              required
            />
            <Input
              label="Senha"
              variant="bordered"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              fullWidth
              endContent={
                <button
                  className="focus:outline-none h-full"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <IoEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />
            <Button type="submit" disabled={loading} color="primary" fullWidth>
              {loading ? "Carregando..." : "Entrar"}
            </Button>
            <div className="text-sm text-gray-600 text-center flex flex-col items-center">
              <Link color="primary" href="/recovery" className="text-sm">
                Esqueci a senha
              </Link>
            </div>
          </form>
          <Divider className="my-8" />
          <div className="text-sm text-gray-600 text-center flex flex-col items-center">
            Ainda não possui uma conta?
            <Link color="primary" href="/signup" className="text-sm">
              Cadastre-se.
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
