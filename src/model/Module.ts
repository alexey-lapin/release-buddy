export default interface Module {
  name: string
  type: 'LIB' | 'APP'
  isRoot: boolean
  template?: string
  main?: string
  imageType?: string
  dependencies: string[]
}
