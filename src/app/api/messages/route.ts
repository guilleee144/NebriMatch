import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getMatchesCollection, createMessage, findMessagesByMatchId, markMessagesAsRead } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
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
    const body = await req.json();
    const { match_id, content } = body;

    if (!match_id || !content || content.trim() === "") {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    // Verificar que el match existe y que el usuario pertenece a él
    const matchesCol = await getMatchesCollection();
    let match;
    try {
      match = await matchesCol.findOne({ _id: new ObjectId(match_id) });
    } catch {
      return NextResponse.json({ error: "match_id no válido" }, { status: 400 });
    }

    if (!match) {
      return NextResponse.json({ error: "Match no encontrado" }, { status: 404 });
    }

    if (match.user1_email !== email && match.user2_email !== email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Crear el mensaje
    await createMessage({
      match_id,
      from_email: email,
      content: content.trim(),
      created_at: new Date(),
      read: false
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error en POST /api/messages:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

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
    const { searchParams } = new URL(req.url);
    const match_id = searchParams.get("match_id");

    if (!match_id) {
      return NextResponse.json({ error: "Falta el parámetro match_id" }, { status: 400 });
    }

    // Verificar pertenencia al match
    const matchesCol = await getMatchesCollection();
    let match;
    try {
      match = await matchesCol.findOne({ _id: new ObjectId(match_id) });
    } catch {
      return NextResponse.json({ error: "match_id no válido" }, { status: 400 });
    }

    if (!match) {
      return NextResponse.json({ error: "Match no encontrado" }, { status: 404 });
    }

    if (match.user1_email !== email && match.user2_email !== email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Marcar mensajes como leídos
    await markMessagesAsRead(match_id, email);

    // Obtener los mensajes del match
    const messages = await findMessagesByMatchId(match_id);

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.error("Error en GET /api/messages:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
