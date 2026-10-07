import { styleText } from "node:util";

export default async (type: "info" | "error", message: string) => {
  const prefix = `[${new Date().toLocaleString()}] [${type.toUpperCase()}]`;
  if (type === "info") return console.log(styleText("yellowBright", `${prefix} ${message}`));
  if (type === "error") return console.log(styleText("redBright", `${prefix} ${message}`));
};
