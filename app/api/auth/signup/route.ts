import bcrypt from "bcrypt";
import createConnection from "@/config/connection";

export async function POST(req: Request) {
  const { nome, email, senha, tipo, numero_contato } = await req.json();

  if (!nome || !email || !senha || !tipo || !numero_contato) {
    return new Response(
      JSON.stringify({ error: "Todos os campos são obrigatórios" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (tipo !== "cliente") {
    return new Response(
      JSON.stringify({ error: "Somente pacientes podem se cadastrar" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  const hashedPassword = await bcrypt.hash(senha, 10);

  let connection;
  try {
    connection = await createConnection();

    // Verifica se o email já está cadastrado
    const [rows]: any = await connection.execute(
      `SELECT id FROM Usuario WHERE email = ?`,
      [email],
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "Este email já está em uso" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Cria o usuário com o novo campo
    await connection.execute(
      `INSERT INTO Usuario (nome, email, senha, tipo, numero_contato) VALUES (?, ?, ?, ?, ?)`,
      [nome, email, hashedPassword, tipo, numero_contato],
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
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
