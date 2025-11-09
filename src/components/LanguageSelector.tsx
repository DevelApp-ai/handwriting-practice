import { Globe } from '@phosphor-icons/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LANGUAGES } from '@/lib/languages'

interface LanguageSelectorProps {
  selectedLanguage: string
  onLanguageChange: (languageCode: string) => void
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-[200px] bg-white/20 backdrop-blur-sm text-white border-white/30">
        <div className="flex items-center gap-2">
          <Globe weight="fill" className="w-5 h-5" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{lang.name}</span>
              <span className="text-muted-foreground text-sm">({lang.nativeName})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
