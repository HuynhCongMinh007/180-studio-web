import { api } from '../api'
import { ENDPOINTS } from '../constants/endpoints'
import { Project } from '../types/projects'

export function getProjects(params?: { offset?: number; limit?: number }) {
  return api.get<Project['GET']>(ENDPOINTS.PROJECTS, { params })
}

export function getProject(id: string) {
  return api.get<Project['GET_DETAIL']>(`${ENDPOINTS.PROJECTS}/${id}`)
}
