import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'UserAuthDB';
const STORE_NAME = 'sessions';

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
}

export async function setItem(key: string, value: any): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, value, key);
}

export async function getItem(key: string): Promise<any> {
  const db = await getDB();
  return db.get(STORE_NAME, key);
}

export async function removeItem(key: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, key);
}

