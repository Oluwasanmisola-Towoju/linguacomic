"use client";

import { type SupportedLanguage } from "@/lib/types";

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (value: SupportedLanguage) => void;
  disabled?: boolean;
}

const LANGUAGES: SupportedLanguage[] = [
  "Nigerian Pidgin",
  "Yoruba",
  "Swahili",
  "French",
  "Spanish"
];

export function LanguageSelector({ value, onChange, disabled = false }: LanguageSelectorProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-200">
      Target language
      <select
        className="glass-panel rounded-xl px-3 py-2 text-sm text-slate-100"
        value={value}
        onChange={(event) => onChange(event.target.value as SupportedLanguage)}
        disabled={disabled}
      >
        {LANGUAGES.map((language) => (
          <option key={language} value={language} className="bg-panel text-slate-100">
            {language}
          </option>
        ))}
      </select>
    </label>
  );
}
