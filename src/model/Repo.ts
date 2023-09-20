import type Module from '@/model/Module'

export default interface Repo {
  repoName: string
  modules: Module[]
}
