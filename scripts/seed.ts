import "./loadEnv";
import bcrypt from "bcryptjs";
import clientPromise from "../src/lib/mongodb";

const users = [
  { id: "user_001", name: "Ana García", email: "ana@nebrimatch.com", password: "Password123" },
  { id: "user_002", name: "Carlos Mendoza", email: "carlos@nebrimatch.com", password: "Password123" },
  { id: "user_003", name: "Laura Jiménez", email: "laura@nebrimatch.com", password: "Password123" },
  { id: "user_004", name: "Marcos Ruiz", email: "marcos@nebrimatch.com", password: "Password123" },
  { id: "user_005", name: "Sofía Valenzuela", email: "sofia@nebrimatch.com", password: "Password123" }
];

const profiles = [
  { email: "ana@nebrimatch.com", description: "UX Designer con 5 años de experiencia en productos digitales premium. Busco equipo para lanzar una startup de edtech.", "empresa/centro_estudios": "Universidad Complutense", edad: 26, ciudad: "Madrid", profile_picture: "" },
  { email: "carlos@nebrimatch.com", description: "Full-stack developer especializado en React y Node.js. Busco proyectos de impacto social.", "empresa/centro_estudios": "Freelance", edad: 24, ciudad: "Barcelona", profile_picture: "" },
  { email: "laura@nebrimatch.com", description: "Data Scientist buscando equipo para lanzar una startup de healthtech. Experiencia en Python y ML.", "empresa/centro_estudios": "Google", edad: 28, ciudad: "Valencia", profile_picture: "" },
  { email: "marcos@nebrimatch.com", description: "Emprendedor en serie. He lanzado 2 startups. Busco CTO técnico para mi próximo proyecto de fintech.", "empresa/centro_estudios": "IE Business School", edad: 32, ciudad: "Sevilla", profile_picture: "" },
  { email: "sofia@nebrimatch.com", description: "AI Research Engineer investigando modelos de lenguaje aplicados a finanzas. Busco co-founders.", "empresa/centro_estudios": "Nebula Labs", edad: 27, ciudad: "Madrid", profile_picture: "" }
];

async function seed() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCol = db.collection("users");
    const userDataCol = db.collection("user_data");

    let inserted = 0;
    let skipped = 0;

    for (const u of users) {
      const exists = await usersCol.findOne({ email: u.email });
      if (exists) {
        console.log(`Usuario ${u.email} ya existe, saltando...`);
        skipped++;
      } else {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await usersCol.insertOne({
          id: u.id,
          name: u.name,
          email: u.email,
          password: hashedPassword,
          createdAt: new Date().toISOString()
        });
        
        const profile = profiles.find(p => p.email === u.email);
        if (profile) {
          await userDataCol.insertOne(profile);
        }
        
        inserted++;
        console.log(`Usuario ${u.email} insertado con su perfil.`);
      }
    }

    console.log(`\n=== RESUMEN ===`);
    console.log(`Insertados: ${inserted}`);
    console.log(`Saltados: ${skipped}`);

  } catch (error) {
    console.error("Error durante el seed:", error);
  } finally {
    const client = await clientPromise;
    await client.close();
    process.exit(0);
  }
}

seed();
