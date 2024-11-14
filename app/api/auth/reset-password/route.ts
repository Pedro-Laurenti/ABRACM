import bcrypt from "bcrypt";
import createConnection from "@/config/connection";

export async function PATCH(req: Request) {
  const { email, token, newPassword } = await req.json();

  if (!email || !token || !newPassword) {
    return new Response(
      JSON.stringify({ error: "Email, token e nova senha são obrigatórios" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  let connection;
  try {
    connection = await createConnection();

    const [rows]: any = await connection.execute(
      `SELECT resetToken, resetTokenExpiry FROM Usuario WHERE email = ?`,
      [email],
    );

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { resetToken, resetTokenExpiry } = rows[0];
    if (
      Date.now() > resetTokenExpiry ||
      !(await bcrypt.compare(token, resetToken))
    ) {
      return new Response(
        JSON.stringify({ error: "Código de Recuperação inválido ou expirado" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await connection.execute(
      `UPDATE Usuario SET senha = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE email = ?`,
      [hashedPassword, email],
    );

    return new Response(
      JSON.stringify({ message: "Senha redefinida com sucesso" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Erro ao redefinir a senha:", error);
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
