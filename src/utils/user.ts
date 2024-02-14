import UserCreateError from "../errors/userCreateError";

type UserParams = Partial<User> & { id: string };

class User {
  readonly id: string;
  readonly createdAt: number;
  lastLoginAt: number;
  profileQuestionsSelection: string[] = [];
  profileText = "";
  name?: string;

  constructor(params: UserParams) {
    if (!params.id) throw new UserCreateError();

    this.id = params.id;
    this.createdAt = params?.createdAt || Date.now();
    this.lastLoginAt = params?.lastLoginAt || this.createdAt;
    this.name = params?.name;
    this.profileQuestionsSelection = params?.profileQuestionsSelection || [];
    this.profileText = params?.profileText || "";
  }

  updateName(newName: string): User {
    this.name = newName;
    return User.clone(this);
  }

  updateProfileQuestionsSelection(
    selection: string[],
    profileText: string
  ): User {
    this.profileQuestionsSelection = selection;
    this.profileText = profileText;
    return User.clone(this);
  }

  static clone(user: User): User {
    return new User({ ...user });
  }
}

export default User;
