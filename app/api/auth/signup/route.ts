import bcrypt from "bcrypt";
import createConnection from "@/config/connection";

export async function POST(req: Request) {
  const { nome, email, senha, tipo_usuario, numero_contato } = await req.json();

  if (!nome || !email || !senha || !tipo_usuario || !numero_contato) {
    return new Response(
      JSON.stringify({ error: "Todos os campos são obrigatórios" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!["administrador", "associado"].includes(tipo_usuario)) {
    return new Response(
      JSON.stringify({ error: "Tipo de usuário inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const hashedPassword = await bcrypt.hash(senha, 10);

  let connection;
  try {
    connection = await createConnection();

    // Verifica se o email já está cadastrado
    const [rows]: any = await connection.execute(
      `SELECT id FROM usuarios WHERE email = ?`,
      [email],
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "Este email já está em uso" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Cria o usuário
    await connection.execute(
      `INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, numero_contato) VALUES (?, ?, ?, ?, ?)`,
      [nome, email, hashedPassword, tipo_usuario, numero_contato],
    );

    return new Response(
      JSON.stringify({ message: "Usuário criado com sucesso" }),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Erro na criação do usuário:", error);
    return new Response(JSON.stringify({ error: "Erro no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
