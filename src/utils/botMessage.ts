class BotMessage {
  private text: string;
  private isBot: boolean;
  private _label?: string;

  constructor(text: string, isBot: boolean = true, label?: string) {
    this.text = text;
    this._label = label;
    this.isBot = isBot;
  }

  toString(): string {
    return [this.label, this.text, "<br>"].join("");
  }

  toHtml(): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "outputWrapper";

    if (this.label) {
      const label = document.createElement("label");
      label.className = "outputLabel";
      label.textContent = this.label;
      wrapper.appendChild(label);
    }

    const output = document.createElement("output");
    output.className = "output";
    output.textContent = this.text;

    wrapper.appendChild(output);

    return wrapper;
  }

  private get label(): string {
    if (this.isBot) {
      return this._label || "Fortune Teller";
    }

    return this._label || "You";
  }
}

export default BotMessage;
