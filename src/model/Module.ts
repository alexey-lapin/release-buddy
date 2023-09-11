export default interface Module {
  name: string
  type: 'LIB' | 'APP'
  dependencies: string[]
}
