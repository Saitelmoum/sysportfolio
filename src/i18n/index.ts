import { en } from "./en";
import { fr } from "./fr";

export const translations = { en, fr } as const;

export const getLangFromPath = (pathname: string): "fr" | "en" => {
  return pathname.startsWith("/en") ? "en" : "fr";
};

export const getSwitchUrl = (pathname: string): string => {
  if (pathname.startsWith("/en")) {
    const withoutPrefix = pathname.replace(/^\/en(\/|$)/, "/");
    return withoutPrefix === "" ? "/" : withoutPrefix;
  }

  if (pathname === "/") {
    return "/en";
  }

  return `/en${pathname}`;
};
