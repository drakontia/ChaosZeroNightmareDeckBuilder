import { ElementType } from "@/types";

export const elementIcons: Record<ElementType, string> = {
  [ElementType.PASSION]: "https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzU1MTRcL2VudHJ5XC9XQnF0cmxXNy5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoyMCwiZml0IjoiY292ZXIifX19",
  [ElementType.JUSTICE]: "https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzU1MTRcL2VudHJ5XC9CRjRsb0tvNS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoyMCwiZml0IjoiY292ZXIifX19",
  [ElementType.ORDER]: "https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzU1MTRcL2VudHJ5XC80aVlJeVM2dC5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoyMCwiZml0IjoiY292ZXIifX19",
  [ElementType.INSTINCT]: "https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzU1MTRcL2VudHJ5XC9zM3RnRzE3US5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoyMCwiZml0IjoiY292ZXIifX19",
  [ElementType.VOID]: "https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzU1MTRcL2VudHJ5XC9HY2xjN3Q5Yi5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIiwicmVzaXplIjp7IndpZHRoIjoyMCwiZml0IjoiY292ZXIifX19",
};

export const getElementIcon = (element?: ElementType): string => {
  if (!element) return "";
  return elementIcons[element] ?? "";
};
