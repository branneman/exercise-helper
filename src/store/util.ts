// Walk an obj/arr recursively, call fn
export const walk =
  (val: any) => (fn: (val: any) => void) => {
    if (typeof val !== 'object' || val === null) {
      return
    }

    fn(val)

    if (Array.isArray(val)) {
      val.forEach((v) => {
        walk(v)(fn)
      })
      return
    }

    for (const key in val) {
      if (!Object.hasOwn(val, key)) continue
      walk(val[key])(fn)
    }
  }

// Return arr with only unique values
export const distinct = (xs: any[]) =>
  xs.reduce(
    (acc, curr) =>
      acc.indexOf(curr) < 0 ? acc.concat([curr]) : acc,
    [],
  )

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('test util: walk()', () => {
    it('call fn for every object', () => {
      const obj = {
        akey: 'aval',
        children: { bkey: 'bval' },
      }

      const actualCalls: any[] = []
      const fn = (arg: any) => actualCalls.push(arg)

      walk(obj)(fn)

      const expectedCalls = [obj, { bkey: 'bval' }]
      expect(actualCalls).toEqual(expectedCalls)
    })

    it('call fn for every object in array (nested)', () => {
      const obj = {
        a: 'a',
        children: [{ b: 'b' }, { c: 'c' }],
      }

      const actualCalls: any[] = []
      const fn = (arg: any) => actualCalls.push(arg)

      walk(obj)(fn)

      const expectedCalls = [
        obj,
        [{ b: 'b' }, { c: 'c' }],
        { b: 'b' },
        { c: 'c' },
      ]
      expect(actualCalls).toEqual(expectedCalls)
    })

    it('able to get all ID fields', () => {
      const obj = {
        id: 'e71e6735-3ada-4a30-ba72-9fe0f839335d',
        name: 'Snowfit intermediate week 4',
        children: [
          {
            id: 'cedc7e4f-ecdf-4003-a845-a71d7ed674f1',
            name: 'Warming up',
            children: [
              {
                id: 'eb39b3d0-702d-4829-b67d-79a3ee7277eb',
                name: 'Drop Squat',
                reps: 20,
                seconds: 2,
              },
            ],
          },
        ],
      }

      const IDs: string[] = []
      const fn = (val: any) => {
        if (val.id) IDs.push(val.id)
      }

      walk(obj)(fn)

      const expectedIDs = [
        'e71e6735-3ada-4a30-ba72-9fe0f839335d',
        'cedc7e4f-ecdf-4003-a845-a71d7ed674f1',
        'eb39b3d0-702d-4829-b67d-79a3ee7277eb',
      ]
      expect(IDs).toEqual(expectedIDs)
    })
  })
}
