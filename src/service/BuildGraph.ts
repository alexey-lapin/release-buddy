import type Module from '../model/Module'
import type Repo from '../model/Repo'
import type PhasedPlan from '../model/PhasedPlan'

export const createBuildPlan = (repos: Repo[], changedModuleNames: string[]): PhasedPlan[] => {
    const nameToRepo = new Map<string, Repo>()
    const nameToModule = new Map<string, Module>()
    const moduleToRepo = new Map<string, Repo>()
    const repoDependencies = new Map<string, Set<string>>()

    repos.forEach((repo) => {
        nameToRepo.set(repo.repoName, repo)
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
                if (depRepo && depRepo.repoName !== repo.repoName) {
                    const existingDeps = repoDependencies.get(depRepo.repoName) || new Set<string>()
                    existingDeps.add(repo.repoName)
                    repoDependencies.set(depRepo.repoName, existingDeps)
                }
            })
        })
    })

    const changedRepos = new Set<string>()
    changedModuleNames.forEach((moduleName) => {
        const repo = moduleToRepo.get(moduleName)
        if (repo) {
            changedRepos.add(repo.repoName)
        }
    })

    const allAffectedRepos = new Set<string>([...changedRepos])
    let queue = [...changedRepos]
    while (queue.length) {
        const currentRepoName = queue.shift()!
        const dependentRepos = repoDependencies.get(currentRepoName);
        if (dependentRepos) {
            dependentRepos.forEach((depRepoName) => {
                if (!allAffectedRepos.has(depRepoName)) {
                    allAffectedRepos.add(depRepoName)
                    queue.push(depRepoName)
                }
            })
        }
    }

    const indegree: Map<string, number> = new Map()
    const processedRepos = new Set<string>()

    allAffectedRepos.forEach((repoName) => {
        indegree.set(repoName, 0)
    })

    allAffectedRepos.forEach((repoName) => {
        repoDependencies.get(repoName)?.forEach((depRepoName) => {
            if (allAffectedRepos.has(depRepoName)) {
                indegree.set(depRepoName, indegree.get(depRepoName)! + 1)
            }
        })
    })

    queue = Array.from(allAffectedRepos)
        .filter((repoName) => indegree.get(repoName) === 0)
    const phasedPlans: PhasedPlan[] = []

    let phase = 1
    while (queue.length) {
        const currentPhaseRepos : Repo[] = []

        const size = queue.length
        for (let i = 0; i < size; i++) {
            const currentRepo = queue.shift()!
            if (processedRepos.has(currentRepo)) {
                continue
            }

            const repo = nameToRepo.get(currentRepo);
            if (repo) {
                currentPhaseRepos.push(repo)
            }
            processedRepos.add(currentRepo)

            repoDependencies.get(currentRepo)?.forEach((depRepoName) => {
                if (allAffectedRepos.has(depRepoName) && !processedRepos.has(depRepoName)) {
                    indegree.set(depRepoName, indegree.get(depRepoName)! - 1)
                    if (indegree.get(depRepoName) === 0) {
                        queue.push(depRepoName)
                    }
                }
            })
        }

        phasedPlans.push({phase, repos: currentPhaseRepos})
        phase++
    }

    return phasedPlans
}
