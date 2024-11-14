import bcrypt from "bcrypt";
import createConnection from "@/config/connection";
import nodemailer from "nodemailer"; // Use uma biblioteca para enviar e-mails

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Email é obrigatório" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = Math.floor(100000 + Math.random() * 900000).toString(); // Gera um token de 6 dígitos
  const hashedToken = await bcrypt.hash(token, 10);
  const expiryTime = Date.now() + 15 * 60 * 1000; // Expira em 15 minutos

  let connection;
  try {
    connection = await createConnection();

    // Atualiza o resetToken e resetTokenExpiry no banco de dados
    await connection.execute(
      `UPDATE Usuario SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?`,
      [hashedToken, expiryTime, email],
    );

    // Configuração de envio de e-mail
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: "contato@filipegabiatti.com",
        pass: "!4bB568521aA$3",
      },
    });

    await transporter.sendMail({
      from: "contato@filipegabiatti.com",
      to: email,
      subject: "Código de recuperação de senha",
      text: `Seu código de recuperação de senha é: ${token}`,
    });

    return new Response(
      JSON.stringify({
        message: "Código de Recuperação enviado para o e-mail",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Erro ao enviar token de recuperação:", error);
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
