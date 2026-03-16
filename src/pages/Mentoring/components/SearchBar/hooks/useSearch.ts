import { useState } from "react";

export const useSearch = () => {
  const [input, setInput] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const cancelSearch = () => {
    setInput("");
  };

  return { input, onChange, cancelSearch };
};
