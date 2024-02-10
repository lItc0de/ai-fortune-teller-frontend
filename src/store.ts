const DATABASE = "fortune-teller";
const DB_VERSION = 1;

import { openDB, IDBPDatabase, DBSchema } from "idb";
import User from "./user";

export interface DBUser {
  id: string;
  createdAt: number;
  lastLoginAt: number;
  lastDetectionAt: number;
  name?: string;
  faceDescriptors: Float32Array[];
}

interface FortuneTeller extends DBSchema {
  users: {
    key: string;
    value: DBUser;
  };
}

class Store {
  db?: IDBPDatabase<FortuneTeller>;
  constructor() {}

  async init() {
    this.db = await openDB<FortuneTeller>(DATABASE, DB_VERSION, {
      upgrade: this.upgrade,
    });
  }

  async getUsers(): Promise<User[]> {
    if (!this.db) return [];

    const dbUsers = await this.db.getAll("users");
    const users: User[] = [];
    for (let i = 0; i < dbUsers.length; i++) {
      users.push(await User.fromDBUser(this, dbUsers[i]));
    }
    return users;
  }

  async addUser(user: User) {
    if (!this.db) return;

    const dbUser: DBUser = {
      id: user.id,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      lastDetectionAt: user.lastDetectionAt,
      name: user.name,
      faceDescriptors: user.labeledFaceDescriptor.descriptors,
    };

    await this.db.add("users", dbUser);
  }

  async updateUser(userId: string, dbUserParams: Partial<DBUser>) {
    if (!this.db) return;

    const oldDBUser = await this.db.get("users", userId);
    if (!oldDBUser) return;

    const newUserParams: DBUser = { ...oldDBUser, ...dbUserParams, id: userId };

    try {
      await this.db.put("users", newUserParams);
    } catch (error) {
      console.error(error);
      console.error({
        oldDBUser,
        newUserParams,
        dbUserParams,
      });
    }
  }

  private upgrade(db: IDBPDatabase<FortuneTeller>, oldVersion: number) {
    if (oldVersion < 1) {
      db.createObjectStore("users", { keyPath: "id" });
    }
  }
}

export default Store;
