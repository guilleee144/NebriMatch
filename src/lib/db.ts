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
