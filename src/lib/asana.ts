const ASANA_BASE = 'https://app.asana.com/api/1.0'

export interface AsanaWorkspace {
  gid: string
  name: string
}

export interface AsanaProject {
  gid: string
  name: string
}

export interface AsanaTask {
  gid: string
  name: string
  completed: boolean
  due_on: string | null
  assignee: { name: string } | null
  permalink_url: string
}

export interface AsanaSettings {
  token: string
  workspaceGid: string
  workspaceName: string
  projectGid: string
  projectName: string
}

async function asanaFetch<T>(token: string, path: string): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${ASANA_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new Error('Could not reach Asana. Check your connection and try again.')
  }
  if (!res.ok) {
    if (res.status === 401) throw new Error('That Asana token was rejected. Double-check it and try again.')
    if (res.status === 403) throw new Error("This token doesn't have access to that resource.")
    if (res.status === 404) throw new Error('Not found — it may have been deleted or renamed in Asana.')
    throw new Error(`Asana API error (${res.status}).`)
  }
  const json = await res.json()
  return json.data as T
}

export function fetchWorkspaces(token: string): Promise<AsanaWorkspace[]> {
  return asanaFetch<AsanaWorkspace[]>(token, '/workspaces')
}

export function fetchProjects(token: string, workspaceGid: string): Promise<AsanaProject[]> {
  return asanaFetch<AsanaProject[]>(
    token,
    `/projects?workspace=${encodeURIComponent(workspaceGid)}&archived=false&limit=100`,
  )
}

export function fetchProjectTasks(token: string, projectGid: string): Promise<AsanaTask[]> {
  const fields = 'name,completed,due_on,assignee.name,permalink_url'
  return asanaFetch<AsanaTask[]>(
    token,
    `/tasks?project=${encodeURIComponent(projectGid)}&opt_fields=${fields}&limit=100`,
  )
}
