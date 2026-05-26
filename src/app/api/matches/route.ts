import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { findMatchesByEmail, findUserDataByEmail, findUserByEmail } from "@/lib/db";

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

    // Obtener todos los matches del usuario
    const matchesList = await findMatchesByEmail(email);

    const matchesDetails = [];

    for (const match of matchesList) {
      // Determinar cuál es el email del otro usuario
      const otherEmail = match.user1_email === email ? match.user2_email : match.user1_email;

      // Obtener el perfil y datos de usuario de la otra persona
      const [otherUserData, otherUser] = await Promise.all([
        findUserDataByEmail(otherEmail),
        findUserByEmail(otherEmail)
      ]);

      if (otherUser) {
        matchesDetails.push({
          id: (match as any)._id.toString(),
          name: otherUser.name,
          email: otherEmail,
          description: otherUserData?.description || "",
          ciudad: otherUserData?.ciudad || "",
          empresa_centro_estudios: otherUserData?.["empresa/centro_estudios"] || "",
          edad: otherUserData?.edad || null,
          profile_picture: otherUserData?.profile_picture || "",
          matched_at: match.created_at
        });
      }
    }

    return NextResponse.json({ matches: matchesDetails }, { status: 200 });
  } catch (error: any) {
    console.error("Error en GET /api/matches:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
