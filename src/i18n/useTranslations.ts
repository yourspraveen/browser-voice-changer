import { useAppContext } from '@/state/useAppContext'
import { translations } from './translations'

export function useTranslations() {
  const { state } = useAppContext()
  return translations[state.ui.language]
}
