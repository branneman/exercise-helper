import { DateTime } from 'luxon'

import type {
  Program,
  Group,
  Exercise,
} from '../../types/state'

export const createExerciseTimer = (
  program: Program,
  start: DateTime
) => {
  return (now: DateTime) => {
    // early return: not yet started
    if (start > now) return { active: false }

    // early return: already done
    const totalSeconds = secondsForProgram(program)
    if (now > start.plus({ seconds: totalSeconds }))
      return { active: false }

    const runningSeconds = now.diff(start).as('seconds')

    const { group, offsetSeconds: groupOffsetSeconds } =
      whichGroup(program, runningSeconds)

    const {
      exercise,
      offsetSeconds: exerciseOffsetSeconds,
    } = whichExercise(
      group,
      runningSeconds - groupOffsetSeconds
    )

    const { rep, secondsLeft } = whichRep(
      exercise.reps,
      exercise.seconds,
      runningSeconds -
        groupOffsetSeconds -
        exerciseOffsetSeconds
    )

    return {
      active: true,
      group,
      exercise,
      rep,
      secondsLeft,
    }
  }
}

const secondsForProgram = (program: Program) => {
  return program.children.reduce(
    (acc, curr) => acc + secondsForGroup(curr),
    0
  )
}

const secondsForGroup = (group: Group) => {
  return group.children.reduce(
    (acc, curr) => acc + secondsForExercise(curr),
    0
  )
}

const secondsForExercise = (e: Exercise) =>
  e.reps * e.seconds

const whichGroup = (
  program: Program,
  runningSeconds: number
) => {
  let min = 0
  let idx = 0
  while (idx < program.children.length) {
    const max = secondsForGroup(program.children[idx])
    if (runningSeconds >= min && runningSeconds < min + max)
      return {
        group: program.children[idx],
        offsetSeconds: min,
      }
    min += max
    idx++
  }

  throw new Error('out of bounds')
}

const whichExercise = (
  group: Group,
  runningSeconds: number
) => {
  let min = 0
  let idx = 0
  while (idx < group.children.length) {
    const max = secondsForExercise(group.children[idx])
    if (runningSeconds >= min && runningSeconds < min + max)
      return {
        exercise: group.children[idx],
        offsetSeconds: min,
      }
    min += max
    idx++
  }

  throw new Error('out of bounds')
}

const whichRep = (
  reps: number,
  secondsPerRep: number,
  runningSeconds: number
) => {
  for (let rep = 0; rep < reps; rep++) {
    const min = rep * secondsPerRep
    const max = min + secondsPerRep
    if (runningSeconds >= min && runningSeconds < max)
      return {
        rep: rep + 1,
        secondsLeft: max - runningSeconds,
      }
  }

  throw new Error('out of bounds')
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('createTimer()', () => {
    describe('single exercise with reps and seconds', () => {
      const id = 'eb39b3d0-702d-4829-b67d-79a3ee7277eb'
      const program = {
        id: '1',
        name: 'My first exercise program',
        children: [
          {
            id: '2',
            name: 'Warming up',
            children: [
              {
                id,
                name: 'Drop Squat',
                reps: 5,
                seconds: 2,
              },
            ],
          },
        ],
      }

      it('before: 1sec before', () => {
        const start = DateTime.now()
        const fakeNow = start.minus({ seconds: 1 })

        const getState = createExerciseTimer(program, start)
        const state = getState(fakeNow)

        expect(state.active).toEqual(false)
      })

      it('during: 100ms after, first rep', () => {
        const start = DateTime.now()
        const fakeNow = start.plus(100) // ms

        const getState = createExerciseTimer(program, start)
        const state = getState(fakeNow)

        expect(state.active).toEqual(true)
        expect(state.rep).toEqual(1)
        expect(state.secondsLeft).toEqual(1.9)
      })

      it('during: 3s after, second rep', () => {
        const start = DateTime.now()
        const fakeNow = start.plus({ seconds: 3 })

        const getState = createExerciseTimer(program, start)
        const state = getState(fakeNow)

        expect(state.active).toEqual(true)
        expect(state.rep).toEqual(2)
        expect(state.secondsLeft).toEqual(1)
      })

      it('during: 7s after, fourth rep', () => {
        const start = DateTime.now()
        const fakeNow = start.plus({ seconds: 7 })

        const getState = createExerciseTimer(program, start)
        const state = getState(fakeNow)

        expect(state.active).toEqual(true)
        expect(state.exercise?.id).toEqual(id)
        expect(state.rep).toEqual(4)
        expect(state.secondsLeft).toEqual(1)
      })

      it('done: 11s after', () => {
        const start = DateTime.now()
        const fakeNow = start.plus({ seconds: 11 })

        const getState = createExerciseTimer(program, start)
        const state = getState(fakeNow)

        expect(state.active).toEqual(false)
      })
    })

    describe('multiple groups, multiple exercises', () => {
      const program = {
        id: '1',
        name: 'My first exercise program',
        children: [
          {
            id: '2',
            name: 'Warming up',
            children: [
              {
                id: '3',
                name: 'Drop Squat',
                reps: 20,
                seconds: 2,
              },
              {
                id: '4',
                name: 'Walking Lunge',
                reps: 1,
                seconds: 30,
              },
            ],
          },
          {
            id: '5',
            name: 'Stamina',
            children: [
              {
                id: '6',
                name: 'Frog Squat',
                reps: 1,
                seconds: 60,
              },
              {
                id: '7',
                name: 'Pulse Squat',
                reps: 1,
                seconds: 60,
              },
            ],
          },
        ],
      }

      it('first group, first exercise, first rep', () => {
        const start = DateTime.now()
        const fakeNow = start.plus({ seconds: 1 })

        const getState = createExerciseTimer(program, start)
        const state = getState(fakeNow)

        expect(state.active).toEqual(true)
        expect(state.exercise?.id).toEqual('3')
        expect(state.secondsLeft).toEqual(1)
      })

      it('first group, second exercise, first rep', () => {
        const start = DateTime.now()
        const fakeNow = start.plus({ seconds: 41 })

        const getState = createExerciseTimer(program, start)
        const state = getState(fakeNow)

        expect(state.active).toEqual(true)
        expect(state.exercise?.id).toEqual('4')
        expect(state.secondsLeft).toEqual(29)
      })

      it('second group, first exercise, first rep', () => {
        const start = DateTime.now()
        const fakeNow = start.plus({ seconds: 71 })

        const getState = createExerciseTimer(program, start)
        const state = getState(fakeNow)

        expect(state.active).toEqual(true)
        expect(state.exercise?.id).toEqual('6')
        expect(state.secondsLeft).toEqual(59)
      })
    })
  })

  describe('secondsForProgram(), secondsForGroup(), secondsForExercise()', () => {
    it('1 group, 1 exercise', () => {
      const program = {
        id: '1',
        name: 'My first exercise program',
        children: [
          {
            id: '2',
            name: 'Warming up',
            children: [
              {
                id: '3',
                name: 'Drop Squat',
                reps: 5,
                seconds: 2,
              },
            ],
          },
        ],
      }

      const s = secondsForProgram(program)
      expect(s).toEqual(10)
    })

    it('1 group, 2 exercises', () => {
      const program = {
        id: '1',
        name: 'My first exercise program',
        children: [
          {
            id: '2',
            name: 'Warming up',
            children: [
              {
                id: '3',
                name: 'Drop Squat',
                reps: 5,
                seconds: 2,
              },
              {
                id: '3',
                name: 'Pulse Squat',
                reps: 1,
                seconds: 60,
              },
            ],
          },
        ],
      }

      const s = secondsForProgram(program)
      expect(s).toEqual(70)
    })
  })

  describe('whichGroup', () => {
    const program = {
      id: '1',
      name: 'My first exercise program',
      children: [
        {
          id: '2',
          name: 'Warming up',
          children: [
            {
              id: '3',
              name: 'Drop Squat',
              reps: 20,
              seconds: 2,
            },
            {
              id: '4',
              name: 'Walking Lunge',
              reps: 1,
              seconds: 30,
            },
          ],
        },
        {
          id: '5',
          name: 'Stamina',
          children: [
            {
              id: '6',
              name: 'Frog Squat',
              reps: 1,
              seconds: 60,
            },
            {
              id: '7',
              name: 'Pulse Squat',
              reps: 1,
              seconds: 60,
            },
          ],
        },
      ],
    }

    it('0 seconds', () => {
      const { group } = whichGroup(program, 0)
      expect(group.id).toEqual('2')
    })

    it('39 seconds', () => {
      const { group } = whichGroup(program, 39)
      expect(group.id).toEqual('2')
    })

    it('41 seconds', () => {
      const { group } = whichGroup(program, 41)
      expect(group.id).toEqual('2')
    })

    it('71 seconds', () => {
      const { group } = whichGroup(program, 71)
      expect(group.id).toEqual('5')
    })

    it('71 seconds', () => {
      expect(() => whichGroup(program, 191)).toThrow()
    })
  })

  describe('whichExercise()', () => {
    const group = {
      id: 'fake id 0',
      name: 'Warming up',
      children: [
        {
          id: 'fake id 1',
          name: 'Drop Squat',
          reps: 5,
          seconds: 2,
        },
        {
          id: 'fake id 2',
          name: 'Pulse Squat',
          reps: 1,
          seconds: 30,
        },
      ],
    }

    it('0 seconds', () => {
      const { exercise, offsetSeconds } = whichExercise(
        group,
        0
      )
      expect(exercise).toEqual(group.children[0])
      expect(offsetSeconds).toEqual(0)
    })

    it('9 seconds', () => {
      const { exercise, offsetSeconds } = whichExercise(
        group,
        9
      )
      expect(exercise).toEqual(group.children[0])
      expect(offsetSeconds).toEqual(0)
    })

    it('11 seconds', () => {
      const { exercise, offsetSeconds } = whichExercise(
        group,
        11
      )
      expect(exercise).toEqual(group.children[1])
      expect(offsetSeconds).toEqual(10)
    })

    it('41 seconds', () => {
      expect(() => whichExercise(group, 41)).toThrow()
    })
  })

  describe('whichRep()', () => {
    it('1 rep, 1 secPerRep, 0 runningSec', () => {
      const reps = 1
      const secondsPerRep = 1
      const runningSeconds = 0

      const { rep, secondsLeft } = whichRep(
        reps,
        secondsPerRep,
        runningSeconds
      )

      expect(rep).toEqual(1)
      expect(secondsLeft).toEqual(1)
    })

    it('2 reps, 3 secPerRep, 5 runningSec', () => {
      const reps = 2
      const secondsPerRep = 3
      const runningSeconds = 5

      const { rep, secondsLeft } = whichRep(
        reps,
        secondsPerRep,
        runningSeconds
      )

      expect(rep).toEqual(2)
      expect(secondsLeft).toEqual(1)
    })

    it('5 reps, 2 secPerRep, 1 runningSec', () => {
      const reps = 5
      const secondsPerRep = 2
      const runningSeconds = 1

      const { rep, secondsLeft } = whichRep(
        reps,
        secondsPerRep,
        runningSeconds
      )

      expect(rep).toEqual(1)
      expect(secondsLeft).toEqual(1)
    })

    it('5 reps, 2 secPerRep, 9 runningSec', () => {
      const reps = 5
      const secondsPerRep = 2
      const runningSeconds = 9

      const { rep, secondsLeft } = whichRep(
        reps,
        secondsPerRep,
        runningSeconds
      )

      expect(rep).toEqual(5)
      expect(secondsLeft).toEqual(1)
    })

    it('1 reps, 30 secPerRep, 14 runningSec', () => {
      const reps = 1
      const secondsPerRep = 30
      const runningSeconds = 14

      const { rep, secondsLeft } = whichRep(
        reps,
        secondsPerRep,
        runningSeconds
      )

      expect(rep).toEqual(1)
      expect(secondsLeft).toEqual(16)
    })

    it('5 reps, 2 secPerRep, 11 runningSec', () => {
      const reps = 5
      const secondsPerRep = 2
      const runningSeconds = 11

      expect(() =>
        whichRep(reps, secondsPerRep, runningSeconds)
      ).toThrow()
    })
  })
}
