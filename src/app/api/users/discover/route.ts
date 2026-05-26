import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getSwipesCollection, getUserDataCollection, getUsersCollection } from "@/lib/db";

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

    // Obtener los emails a los que ya se les ha hecho swipe
    const swipesCol = await getSwipesCollection();
    const swipes = await swipesCol.find({ from_email: email }).toArray();
    const swipedEmails = swipes.map(s => s.to_email);

    // Obtener perfiles de user_data excluyendo al propio usuario y a los ya swipeados
    const userDataCol = await getUserDataCollection();
    const discoverUsers = await userDataCol
      .find({
        email: { $ne: email, $nin: swipedEmails }
      })
      .limit(20)
      .toArray();

    // Mapear al formato esperado por el frontend
    const profilesBase = discoverUsers.map(user => ({
      name: user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1),
      email: user.email,
      description: user.description,
      empresa_centro_estudios: user["empresa/centro_estudios"],
      edad: user.edad,
      ciudad: user.ciudad,
      profile_picture: user.profile_picture
    }));

    // Obtener el nombre real de cada usuario consultando la colección de users
    const usersCol = await getUsersCollection();
    const userEmails = profilesBase.map(p => p.email);
    const usersList = await usersCol.find({ email: { $in: userEmails } }).toArray();

    const finalizedProfiles = profilesBase.map(p => {
      const realUser = usersList.find(u => u.email === p.email);
      return {
        ...p,
        name: realUser ? realUser.name : p.name
      };
    });

    return NextResponse.json({ profiles: finalizedProfiles }, { status: 200 });
  } catch (error: any) {
    console.error("Error en GET /api/users/discover:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
