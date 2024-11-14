import createConnection from "@/config/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, senha } = await req.json();

  if (!email || !senha) {
    return new Response(
      JSON.stringify({ error: "Email e senha são obrigatórios" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  let connection;
  try {
    connection = await createConnection();

    const [rows]: any = await connection.execute(
      `SELECT id, senha, tipo FROM Usuario WHERE email = ?`,
      [email],
    );

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: "Credenciais inválidas" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return new Response(JSON.stringify({ error: "Credenciais inválidas" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Obter a chave secreta da variável de ambiente
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("SECRET_KEY não definida no ambiente");
    }

    // Gerar token JWT
    const token = jwt.sign({ id: user.id, tipo: user.tipo }, secretKey, {
      expiresIn: "10h",
    });

    // Configurar o cookie HttpOnly e Secure
    const response = new Response(
      JSON.stringify({ message: "Login realizado com sucesso" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );

    response.headers.append(
      "Set-Cookie",
      `authToken=${token}; HttpOnly; Secure; Path=/; Max-Age=3600`,
    );

    return response;
  } catch (error) {
    console.error("Erro na conexão ou autenticação:", error);
    return new Response(JSON.stringify({ error: "Erro no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
