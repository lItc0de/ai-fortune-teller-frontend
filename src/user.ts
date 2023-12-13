type UserType = "bot" | "person";

class User {
  id: string;
  type: UserType;

  constructor(id: string, type: UserType) {
    this.id = id;
    this.type = type;
  }
}

export default User;
