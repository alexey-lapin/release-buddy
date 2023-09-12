import type Module from '../model/Module'
import type Repo from '../model/Repo'
import type PhasedPlan from '../model/PhasedPlan'

export const createBuildPlan = (repos: Repo[], changedModuleNames: string[]): PhasedPlan[] => {
  const nameToModule = new Map<string, Module>()
  const moduleToRepo = new Map<string, Repo>()
  const repoDependencies = new Map<string, Set<string>>()

  repos.forEach((repo) => {
    repo.modules.forEach((module) => {
      nameToModule.set(module.name, module)
      moduleToRepo.set(module.name, repo)
    })
  })

  repos.forEach((repo) => {
    repo.modules.forEach((module) => {
      module.dependencies.forEach((depName) => {
        const depModuleName = depName.split(':').pop()!
        const depRepo = moduleToRepo.get(depModuleName)
        if (depRepo && depRepo.name !== repo.name) {
          const existingDeps = repoDependencies.get(depRepo.name) || new Set<string>()
          existingDeps.add(repo.name)
          repoDependencies.set(depRepo.name, existingDeps)
        }
      })
    })
  })

  const changedRepos = new Set<string>()
  changedModuleNames.forEach((moduleName) => {
    const repo = moduleToRepo.get(moduleName)
    if (repo) {
      changedRepos.add(repo.name)
    }
  })

  const indegree: Map<string, number> = new Map()
  const processedRepos = new Set<string>()

  changedRepos.forEach((repoName) => {
    indegree.set(repoName, 0)
  })

  changedRepos.forEach((repoName) => {
    repoDependencies.get(repoName)?.forEach((depRepoName) => {
      if (changedRepos.has(depRepoName)) {
        indegree.set(depRepoName, indegree.get(depRepoName)! + 1)
      }
    })
  })

  const queue: Repo[] = Array.from(changedRepos)
    .filter((repoName) => indegree.get(repoName) === 0)
    .map((repoName) => repos.find((repo) => repo.name === repoName)!)
  const phasedPlans: PhasedPlan[] = []

  let phase = 1
  while (queue.length) {
    const currentPhaseRepos = []

    const size = queue.length
    for (let i = 0; i < size; i++) {
      const currentRepo = queue.shift()!
      if (processedRepos.has(currentRepo.name)) {
        continue
      }

      currentPhaseRepos.push(currentRepo)
      processedRepos.add(currentRepo.name)

      repoDependencies.get(currentRepo.name)?.forEach((depRepoName) => {
        if (changedRepos.has(depRepoName) && !processedRepos.has(depRepoName)) {
          indegree.set(depRepoName, indegree.get(depRepoName)! - 1)
          if (indegree.get(depRepoName) === 0) {
            queue.push(repos.find((repo) => repo.name === depRepoName)!)
          }
        }
      })
    }

    phasedPlans.push({ phase, repos: currentPhaseRepos })
    phase++
  }

  return phasedPlans
}
