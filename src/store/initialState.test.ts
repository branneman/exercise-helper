import { validate } from 'uuid'
import { walk, distinct } from './util'
import { State } from '../types/state'
import initialState from './initialState.json'

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  const state: State = initialState

  describe('initialState sanity checks', () => {
    it('all IDs are unique', () => {
      const IDs: string[] = []
      walk(state)((val: any) => {
        if (val.id) IDs.push(val.id)
      })

      expect(IDs).toEqual(distinct(IDs))
    })

    it('all IDs are valid uuid v4', () => {
      const IDs: string[] = []
      walk(state)((val: any) => {
        if (typeof val.id !== 'undefined') IDs.push(val.id)
      })

      IDs.forEach((id) => {
        try {
          expect(
            typeof id === 'string' && id.length > 0,
          ).toEqual(true)
          expect(validate(id)).toEqual(true)
        } catch (_err) {
          throw new Error('Invalid uuid v4: ' + id)
        }
      })
    })
  })
}
