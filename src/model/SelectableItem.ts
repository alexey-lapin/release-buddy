import type { ItemType, ComponentType } from '@/model/AliasTypes'

export default interface SelectableItem {
    name: string
    itemType: ItemType
    componentType: ComponentType
    repo: string
}