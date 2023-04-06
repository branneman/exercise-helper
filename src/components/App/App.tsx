import { useReducer } from 'react'
import { State } from '../../types/state'
import {
  reducer,
  initialState as defaultInitialState,
} from '../../reducers/root'
import ListPrograms from '../ListPrograms'
import './App.css'

export default function App(props: {
  initialState?: State
}) {
  const initialState: State =
    Array.isArray(props.initialState) &&
    props.initialState.length
      ? props.initialState
      : defaultInitialState
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  )

  return (
    <div className="App">
      <h1>Exercise Helper</h1>
      <ListPrograms state={state} dispatch={dispatch} />
    </div>
  )
}
