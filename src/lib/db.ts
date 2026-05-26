import clientPromise from "./mongodb";
import fs from "fs";
import path from "path";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface StoredUserData {
  email: string;
  description: string;
  profile_picture: string;
  "empresa/centro_estudios": string;
  edad: number | null;
  ciudad: string;
}

const DB_PATH = path.join(process.cwd(), "data", "users.json");

// Helper para migrar datos de JSON a MongoDB si la base de datos está vacía
async function ensureMigrated(): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<StoredUser>("users");
    const count = await collection.countDocuments();
    
    if (count === 0 && fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      const localUsers: StoredUser[] = JSON.parse(data);
      if (localUsers.length > 0) {
        console.log(`[Migration] Migrando ${localUsers.length} usuarios a MongoDB Atlas...`);
        // Asegurar índice único en email antes de insertar
        await collection.createIndex({ email: 1 }, { unique: true });
        await collection.insertMany(localUsers);
        console.log("[Migration] ¡Migración completada con éxito!");
      }
    }

    // Asegurar índice único en email para user_data
    const userDataCol = db.collection<StoredUserData>("user_data");
    try {
      await userDataCol.dropIndex("user_id_1");
    } catch {}
    await userDataCol.createIndex({ email: 1 }, { unique: true });

    // Migración automática para usuarios existentes que no tengan registro en user_data
    const users = await collection.find({}).toArray();
    for (const user of users) {
      const exists = await userDataCol.findOne({ email: user.email });
      if (!exists) {
        await userDataCol.insertOne({
          email: user.email,
          description: "",
          profile_picture: "",
          "empresa/centro_estudios": "",
          edad: null,
          ciudad: ""
        });
        console.log(`[Migration] Creado perfil por defecto para el usuario: ${user.email}`);
      }
    }
  } catch (err) {
    console.error("Error durante la migración de datos:", err);
  }
}

// Ejecutar migración al importar el módulo
ensureMigrated().catch(console.error);

export async function getUsersCollection() {
  const client = await clientPromise;
  return client.db().collection<StoredUser>("users");
}

export async function getUserDataCollection() {
  const client = await clientPromise;
  return client.db().collection<StoredUserData>("user_data");
}

export async function readUsers(): Promise<StoredUser[]> {
  const collection = await getUsersCollection();
  return collection.find({}).toArray();
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const collection = await getUsersCollection();
  const user = await collection.findOne({ email });
  return user || undefined;
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const collection = await getUsersCollection();
  const user = await collection.findOne({ id });
  return user || undefined;
}

export async function createUser(user: StoredUser): Promise<void> {
  const collection = await getUsersCollection();
  // Asegurar el índice único para el campo email
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.insertOne(user);
}

export async function findUserDataByEmail(email: string): Promise<StoredUserData | undefined> {
  const collection = await getUserDataCollection();
  const data = await collection.findOne({ email });
  return data || undefined;
}

export async function createUserData(userData: StoredUserData): Promise<void> {
  const collection = await getUserDataCollection();
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.insertOne(userData);
}

export async function updateUserDataByEmail(email: string, data: Partial<Omit<StoredUserData, "email">>): Promise<void> {
  const collection = await getUserDataCollection();
  await collection.updateOne({ email }, { $set: data });
}
