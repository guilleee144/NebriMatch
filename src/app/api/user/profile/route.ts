import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { findUserByEmail, findUserDataByEmail, createUserData, updateUserDataByEmail } from "@/lib/db";

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

    const user = await findUserByEmail(payload.email);
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    let userData = await findUserDataByEmail(payload.email);
    if (!userData) {
      userData = {
        email: payload.email,
        description: "",
        profile_picture: "",
        "empresa/centro_estudios": "",
        edad: null,
        ciudad: "",
      };
      await createUserData(userData);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      profile: userData,
    }, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/user/profile:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const user = await findUserByEmail(payload.email);
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const body = await req.json();

    // Sanitizar y validar tipos para evitar problemas de tipos en DB
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const empresaCentro = typeof body["empresa/centro_estudios"] === "string" ? body["empresa/centro_estudios"].trim() : "";
    const ciudad = typeof body.ciudad === "string" ? body.ciudad.trim() : "";
    
    let edad: number | null = null;
    if (body.edad !== undefined && body.edad !== null && body.edad !== "") {
      const parsedEdad = Number(body.edad);
      if (!isNaN(parsedEdad) && parsedEdad >= 0) {
        edad = parsedEdad;
      }
    }

    const profilePicture = typeof body.profile_picture === "string" ? body.profile_picture.trim() : "";
    if (profilePicture !== "") {
      // Validar formato de imagen (soporta Base64 con prefijo data:image/ o URL tradicional terminada en extensiones válidas)
      const isBase64 = /^data:image\/(png|jpeg|jpg);base64,/i.test(profilePicture);
      const isUrl = /\.(jpeg|jpg|png)$/i.test(profilePicture);
      if (!isBase64 && !isUrl) {
        return NextResponse.json(
          { error: "Formato de imagen no válido. Solo se admiten archivos jpeg, jpg y png" },
          { status: 400 }
        );
      }
    }

    const updatePayload = {
      description,
      profile_picture: profilePicture,
      "empresa/centro_estudios": empresaCentro,
      edad,
      ciudad,
    };

    await updateUserDataByEmail(payload.email, updatePayload);

    return NextResponse.json({
      message: "Perfil actualizado correctamente",
      profile: {
        email: payload.email,
        ...updatePayload,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error en PUT /api/user/profile:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
