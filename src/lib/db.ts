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

    // Crear índice único compuesto { from_email, to_email } en swipes
    const swipesCol = db.collection("swipes");
    try { await swipesCol.dropIndex("from_email_1_to_email_1"); } catch {}
    await swipesCol.createIndex({ from_email: 1, to_email: 1 }, { unique: true });

    // Crear índice compuesto { user1_email, user2_email } en matches
    const matchesCol = db.collection("matches");
    try { await matchesCol.dropIndex("user1_email_1_user2_email_1"); } catch {}
    await matchesCol.createIndex({ user1_email: 1, user2_email: 1 }, { unique: true });

    // Crear índice sobre match_id en messages
    const messagesCol = db.collection("messages");
    try { await messagesCol.dropIndex("match_id_1"); } catch {}
    await messagesCol.createIndex({ match_id: 1 });
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

export interface StoredSwipe {
  from_email: string;
  to_email: string;
  action: "like" | "pass";
  created_at: Date;
}

export interface StoredMatch {
  user1_email: string;
  user2_email: string;
  status: "matched";
  created_at: Date;
}

export async function getSwipesCollection() {
  const client = await clientPromise;
  return client.db().collection<StoredSwipe>("swipes");
}

export async function getMatchesCollection() {
  const client = await clientPromise;
  return client.db().collection<StoredMatch>("matches");
}

export async function createSwipe(swipe: StoredSwipe): Promise<void> {
  const collection = await getSwipesCollection();
  await collection.insertOne(swipe);
}

export async function findSwipe(from_email: string, to_email: string): Promise<StoredSwipe | undefined> {
  const collection = await getSwipesCollection();
  const swipe = await collection.findOne({ from_email, to_email });
  return swipe || undefined;
}

export async function createMatch(match: StoredMatch): Promise<void> {
  const collection = await getMatchesCollection();
  await collection.insertOne(match);
}

export async function findMatchesByEmail(email: string): Promise<StoredMatch[]> {
  const collection = await getMatchesCollection();
  return collection.find({
    $or: [{ user1_email: email }, { user2_email: email }]
  }).toArray();
}

export interface StoredMessage {
  match_id: string;
  from_email: string;
  content: string;
  created_at: Date;
  read: boolean;
}

export async function getMessagesCollection() {
  const client = await clientPromise;
  return client.db().collection<StoredMessage>("messages");
}

export async function createMessage(message: StoredMessage): Promise<void> {
  const collection = await getMessagesCollection();
  await collection.insertOne(message);
}

export async function findMessagesByMatchId(match_id: string): Promise<StoredMessage[]> {
  const collection = await getMessagesCollection();
  return collection.find({ match_id }).sort({ created_at: 1 }).toArray();
}

export async function markMessagesAsRead(match_id: string, reader_email: string): Promise<void> {
  const collection = await getMessagesCollection();
  await collection.updateMany(
    { match_id, from_email: { $ne: reader_email }, read: false },
    { $set: { read: true } }
  );
}
