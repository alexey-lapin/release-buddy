import type { ComponentType, ItemType } from '@/model/AliasTypes'

export default interface TreeItem {
  key: string
  data: {
    name: string
    itemType: ItemType
    componentType: ComponentType
    isRoot: boolean | null
    template: string | null
    main: string | null
    dependencies: string[]
  }
  children?: TreeItem[]
}
