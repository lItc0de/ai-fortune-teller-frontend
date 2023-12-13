class InOutHelper {
  private output: HTMLOutputElement;
  private input: HTMLInputElement;
  private form: HTMLFormElement;
  private inputHandler?: (msg: string) => void;

  constructor() {
    this.output = document.getElementById("aiOutput") as HTMLOutputElement;
    this.input = document.getElementById("mainInput") as HTMLInputElement;
    this.form = document.getElementById("mainForm") as HTMLFormElement;
  }

  write(msg: string) {
    this.output.innerHTML = msg;
  }

  registerInputHandler(handler: (msg: string) => void) {
    this.inputHandler = handler;
    this.removeEventListener();
    this.addEventListener();
  }

  private addEventListener() {
    this.form.addEventListener("submit", this.submitHandler);
  }

  private removeEventListener() {
    this.form.removeEventListener("submit", this.submitHandler);
  }

  private submitHandler = (ev: any) => {
    ev.preventDefault();

    const msg = this.input.value;
    if (this.inputHandler) this.inputHandler(msg);
    this.input.value = "";
  };
}

export default InOutHelper;