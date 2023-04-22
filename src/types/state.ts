export type State = Array<Program>

export type Program = {
  id: string
  name: string
  children: Array<Group>
}

export type Group = {
  id: string
  name: string
  children: Array<Exercise>
}

export type Exercise = {
  id: string
  name: string
  reps: number
  seconds: number
}
