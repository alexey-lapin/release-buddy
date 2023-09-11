export default interface SelectableItem {
    name: string
    itemType: "LIB" | "APP" | "REP"
    componentType: "LIB" | "APP" | "MIX"
    repo: string
}