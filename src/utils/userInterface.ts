import User from "../user";

class UserInterface {
  private _show = false;
  user?: User;
  uiElement: HTMLDivElement;

  constructor() {
    this.uiElement = document.getElementById(
      "user-interface"
    ) as HTMLDivElement;
  }

  login(user: User) {
    console.log(user);

    this.user = user;
    this.show = true;

    const userInfo = document.createElement("span");
    userInfo.textContent = user.name ? `User: ${user.name}` : "New User";
    this.uiElement.appendChild(userInfo);
  }

  logout() {
    this.show = false;
    this.user = undefined;
    this.uiElement.innerHTML = "";
  }

  get show() {
    return this._show;
  }

  set show(show: boolean) {
    if (show) this.uiElement.style.display = "block";
    else this.uiElement.style.display = "none";

    this._show = show;
  }
}

export default UserInterface;
