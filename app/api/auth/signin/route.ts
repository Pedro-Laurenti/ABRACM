import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createConnection from "@/config/connection";

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
      `SELECT id, senha_hash, tipo_usuario FROM usuarios WHERE email = ?`,
      [email],
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const [user] = rows;
    const isValidPassword = await bcrypt.compare(senha, user.senha_hash);

    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ error: "Senha inválida" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("SECRET_KEY is not defined");
    }

    const token = jwt.sign({ id: user.id, tipo_usuario: user.tipo_usuario }, secretKey, {
      expiresIn: "1h",
    });

    return new Response(
      JSON.stringify({ token, tipo_usuario: user.tipo_usuario }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `authToken=${token}; HttpOnly; Secure; Path=/; Max-Age=3600`,
        },
      },
    );
    
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    return new Response(
      JSON.stringify({ error: "Erro no servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}