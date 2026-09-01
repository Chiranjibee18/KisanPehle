// @ts-check
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translationsPath = path.resolve(__dirname, '../src/i18n/translations.ts');
const fileContent = fs.readFileSync(translationsPath, 'utf8');

// Match TRANSLATIONS dictionary
const dictMatch = fileContent.match(/export const TRANSLATIONS: Record<string, Record<string, string>> = ({[\s\S]*?});\n/);
if (!dictMatch) {
  console.error('❌ Failed to parse TRANSLATIONS dictionary from translations.ts');
  process.exit(1);
}

const translations = JSON.parse(dictMatch[1]);
const locales = Object.keys(translations);
const enKeys = Object.keys(translations.en || {});

console.log(`🌐 Kisan Pehele i18n Verification:`);
console.log(`   - Supported Locales: ${locales.length} (${locales.join(', ')})`);
console.log(`   - Canonical English (en) Key Count: ${enKeys.length}`);

let totalErrors = 0;

if (!translations.en || enKeys.length === 0) {
  console.error('❌ Canonical English dictionary is missing or empty!');
  process.exit(1);
}

// Verify that every key in English is a non-empty string
for (const key of enKeys) {
  if (typeof translations.en[key] !== 'string' || translations.en[key].trim() === '') {
    console.error(`❌ Empty or invalid English translation for key: "${key}"`);
    totalErrors++;
  }
}

// Check coverage across all languages
for (const loc of locales) {
  const locKeys = Object.keys(translations[loc] || {});
  const missingInLoc = enKeys.filter(k => !(k in translations[loc]));
  
  if (missingInLoc.length > 0) {
    console.log(`⚠️  Locale [${loc}] has ${locKeys.length}/${enKeys.length} keys (Controlled fallback to English for ${missingInLoc.length} keys)`);
  } else {
    console.log(`✅ Locale [${loc}] is 100% complete (${locKeys.length}/${enKeys.length} keys)`);
  }
}

if (totalErrors > 0) {
  console.error(`\n❌ i18n Validation failed with ${totalErrors} errors.`);
  process.exit(1);
} else {
  console.log(`\n🎉 All ${locales.length} languages passed i18n architecture validation!`);
  process.exit(0);
}
