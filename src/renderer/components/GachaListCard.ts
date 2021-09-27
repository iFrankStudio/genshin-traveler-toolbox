export interface ListItem {
  id: string
  name: string
  type: 'character' | 'weapon'
  rate?: '5' | '4' | '3'
  note?: string | number
}
