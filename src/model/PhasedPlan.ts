import type Repo from '@/model/Repo'

export default interface PhasedPlan {
  phase: number
  repos: Repo[]
}
