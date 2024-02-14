const DATABASE = "fortune-teller";
const DB_VERSION = 1;

import { openDB, IDBPDatabase, DBSchema } from "idb";
import User from "./utils/user";
import DetectionUser from "./faceRecognition/detectionUser";

export interface DBUser {
  id: string;
  createdAt: number;
  lastLoginAt: number;
  lastDetectionAt: number;
  faceDescriptors: Float32Array[];
  name?: string;
  profileQuestionsSelection?: string[];
  profileText: string;
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

  getUsers = async (): Promise<User[]> => {
    if (!this.db) return [];

    const dbUsers = await this.db.getAll("users");
    const users: User[] = [];
    for (let i = 0; i < dbUsers.length; i++) {
      users.push(new User(dbUsers[i]));
    }
    return users;
  };

  getDetectionUsers = async (): Promise<DetectionUser[]> => {
    if (!this.db) return [];

    const dbUsers = await this.db.getAll("users");
    const users: DetectionUser[] = [];
    for (let i = 0; i < dbUsers.length; i++) {
      users.push(new DetectionUser(dbUsers[i]));
    }
    return users;
  };

  addUser = async (detectionUser: DetectionUser) => {
    if (!this.db) return;
    const createdAt = Date.now();

    const dbUser: DBUser = {
      id: detectionUser.id,
      faceDescriptors: detectionUser.labeledFaceDescriptor.descriptors,
      lastDetectionAt: detectionUser.lastDetectionAt,
      createdAt,
      lastLoginAt: createdAt,
      profileText: "",
    };

    await this.db.add("users", dbUser);
  };

  updateUser = async (dbUserParams: Partial<DBUser> & { id: string }) => {
    if (!this.db) return;

    const oldDBUser = await this.db.get("users", dbUserParams.id);
    if (!oldDBUser) return;

    const newUserParams: DBUser = { ...oldDBUser, ...dbUserParams };

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
  };

  private upgrade(db: IDBPDatabase<FortuneTeller>, oldVersion: number) {
    if (oldVersion < 1) {
      db.createObjectStore("users", { keyPath: "id" });
    }
  }
}

export default Store;
