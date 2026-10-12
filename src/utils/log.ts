import { styleText } from "node:util";

const debug: boolean = true;

export default async (type: "ready" | "info" | "error" | "debug", message: string) => {
  const prefix = `[${new Date().toLocaleString()}] [${type.toUpperCase()}]`;
  if (type === "ready") return console.log(styleText("green", `${prefix} ${message}`));
  if (type === "info") return console.log(styleText("yellow", `${prefix} ${message}`));
  if (type === "error") return console.log(styleText("red", `${prefix} ${message}`));
  if (type === "debug" && debug) return console.log(styleText("blue", `${prefix} ${message}`));
};
