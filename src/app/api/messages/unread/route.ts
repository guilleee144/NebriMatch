import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { findMatchesByEmail, getMessagesCollection } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const email = payload.email;
    const matches = await findMatchesByEmail(email);

    if (matches.length === 0) {
      return NextResponse.json({ count: 0 });
    }

    const matchIds = matches.map((m: any) => m._id.toString());
    const messagesCol = await getMessagesCollection();

    const result = await messagesCol.countDocuments({
      match_id: { $in: matchIds },
      from_email: { $ne: email },
      read: false
    });

    return NextResponse.json({ count: result });
  } catch (error: any) {
    console.error("Error en GET /api/messages/unread:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
