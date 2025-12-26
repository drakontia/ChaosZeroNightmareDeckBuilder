// /lib/loadMessages.ts
// 各言語の messages/{lang}/equipment.json, cards.json, common.json をマージして1つの辞書として返すユーティリティ
import fs from 'fs';
import path from 'path';

export function loadMessages(lang: string): Record<string, any> {
  const baseDir = path.join(process.cwd(), 'messages', lang);
  const files = ['common.json', 'equipment.json', 'charcter_cards.json', 'cards.json'];
  let merged: Record<string, any> = {};

  for (const file of files) {
    const filePath = path.join(baseDir, file);
    if (fs.existsSync(filePath)) {
      const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      merged = { ...merged, ...json };
    }
  }
  return merged;
}

// Next.js (next-intl) で使う場合は、getMessages などでこの関数を呼び出して利用してください。
