import createConnection from "@/config/connection";

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("user-id"); // Supondo que o ID do usuário venha nos headers

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Usuário não autenticado" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    let connection;
    try {
      connection = await createConnection();

      // Consulta o stripe_customer_id do banco
      const [rows]: any = await connection.execute(
        `SELECT stripe_customer_id FROM usuarios WHERE id = ?`,
        [userId],
      );

      if (!rows || rows.length === 0) {
        return new Response(
          JSON.stringify({ error: "Cliente não encontrado" }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }

      const stripeCustomerId = rows[0].stripe_customer_id;

      return new Response(
        JSON.stringify({ stripeCustomerId }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      console.error("Erro ao consultar cliente:", error);
      return new Response(
        JSON.stringify({ error: "Erro interno do servidor" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    console.error("Erro na API:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar a solicitação" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
