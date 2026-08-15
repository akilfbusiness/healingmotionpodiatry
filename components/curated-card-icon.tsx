import { Footprints, icons, type LucideIcon, type LucideProps } from 'lucide-react'

// Looks up a lucide-react icon by the PascalCase name an editor typed into
// the Studio (e.g. "Footprints", "MapPin"). Falls back to `fallback` (or
// Footprints) if the name is blank or doesn't match a real icon, so a typo
// never breaks the card layout.
export function CuratedCardIcon({
  name,
  fallback: Fallback = Footprints,
  ...props
}: { name?: string; fallback?: LucideIcon } & LucideProps) {
  const Icon = (name && icons[name as keyof typeof icons]) || Fallback
  return <Icon {...props} />
}
