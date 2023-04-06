export type State = Array<Program>

export interface Program {
  name: string
  children: Array<Group>
}

export interface Group {
  name: string
  children: Array<Exercise>
}

export interface Exercise {
  name: string
  sets?: number
  reps?: number
  seconds?: number
}
