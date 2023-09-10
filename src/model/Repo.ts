import type Module from '@/model/Module'

export default interface Repo {
  name: string
  modules: Module[]
}
