export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked'
export type TaskPriority = 'critical' | 'high' | 'medium' | 'quick_win'
export type TaskAssignee = 'Dhruvi' | 'Deepak' | 'Janey' | 'Smit'
export type SprintStatus = 'active' | 'completed' | 'paused'
export type UserRole = 'admin' | 'member'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  can_see_dashboard: boolean
  can_see_sprints: boolean
  can_see_surveys: boolean
  is_active: boolean
  created_at: string
}

export interface Sprint {
  id: string
  name: string
  description: string
  status: SprintStatus
  sprint_number: number
  created_at: string
}

export interface Task {
  id: string
  sprint_id: string
  issue_number: number
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  assignee: TaskAssignee
  phase: number
  phase_label: string
  category: string
  is_mobile: boolean
  not_required: boolean
  dev_effort: string
  fix_summary: string
  created_at: string
  updated_at: string
}

export interface QuizResult {
  id: string
  submitted_by: string
  submitted_at: string
  angle_1_pct: number
  angle_2_pct: number
  angle_3_pct: number
  angle_4_pct: number
  angle_5_pct: number
  angle_6_pct: number
  angle_7_pct: number
  angle_8_pct: number
  angle_1_note: string
  angle_2_note: string
  angle_3_note: string
  angle_4_note: string
  angle_5_note: string
  angle_6_note: string
  angle_7_note: string
  angle_8_note: string
}
