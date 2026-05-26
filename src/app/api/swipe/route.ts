import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createSwipe, findSwipe, createMatch } from "@/lib/db";

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

    const body = await req.json();
    const { to_email, action } = body;

    if (!to_email || !action || (action !== "like" && action !== "pass")) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const from_email = payload.email;

    // Guardar el swipe
    try {
      await createSwipe({
        from_email,
        to_email,
        action,
        created_at: new Date()
      });
    } catch (err: any) {
      if (err.code !== 11000) {
        throw err;
      }
    }

    let matched = false;
    if (action === "like") {
      const inverseSwipe = await findSwipe(to_email, from_email);
      if (inverseSwipe && inverseSwipe.action === "like") {
        matched = true;
        try {
          await createMatch({
            user1_email: from_email,
            user2_email: to_email,
            status: "matched",
            created_at: new Date()
          });
        } catch (err: any) {
          if (err.code !== 11000) {
            throw err;
          }
        }
      }
    }

    return NextResponse.json({ success: true, matched }, { status: 200 });
  } catch (error: any) {
    console.error("Error en POST /api/swipe:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
