import { useEffect } from "react";

export type ButtonProps = {
  number: number;
  label: string;
  onClick: (number: number) => void;
};

const Button: React.FC<ButtonProps> = ({ number, label, onClick }) => {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === number.toString()) {
        document.removeEventListener("keydown", handleKeydown);
        onClick(number);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [number, onClick]);

  return <button onClick={() => onClick(number)}>{label}</button>;
};

export default Button;
