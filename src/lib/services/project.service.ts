import { api } from '../api'
import { ENDPOINTS } from '../constants/endpoints'

export async function getProjects(): Promise<any> {
  const res = await api.get(ENDPOINTS.PROJECTS)
  return res.data
}
