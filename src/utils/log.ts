import { styleText } from "node:util";

export default async (type: "ready" | "info" | "error", message: string) => {
  const prefix = `[${new Date().toLocaleString()}] [${type.toUpperCase()}]`;
  if (type === "ready") return console.log(styleText("green", `${prefix} ${message}`));
  if (type === "info") return console.log(styleText("yellow", `${prefix} ${message}`));
  if (type === "error") return console.log(styleText("red", `${prefix} ${message}`));
};
