import { State } from '../../types/state'

export default function ListPrograms(props: {
  state: State
  dispatch: (action: {
    type: string
    payload?: any
  }) => State
}) {
  const { state, dispatch } = props

  return (
    <ol>
      {state.map((program) => (
        <li key={program.name}>{program.name}</li>
      ))}
    </ol>
  )
}
