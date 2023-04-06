import { State } from '../types/state'
import initialState from './initialState.json'

function reducer(state: State, action: { type: string }) {
  switch (action.type) {
    default:
      throw new Error(`Unknown action.type: ${action.type}`)
  }
}

export { reducer, initialState }
