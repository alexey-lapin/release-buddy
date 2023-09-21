export default interface Module {
  name: string
  type: 'LIB' | 'APP'
  isRoot: boolean
  template: string | null
  main: string | null
  imageType: string | null
  dependencies: string[]
}
