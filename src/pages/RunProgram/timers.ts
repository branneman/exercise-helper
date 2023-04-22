import type { Exercise } from '../../types/state'
import { DateTime } from 'luxon'

export const createExerciseTimer = (
  exercises: Exercise[],
  start: DateTime
) => {
  return (now: DateTime) => {
    // early return: not yet started
    if (start > now) return { active: null }

    // early return: already done
    const totalSeconds = secondsForAllExercises(exercises)
    if (now > start.plus({ seconds: totalSeconds }))
      return { active: null }

    const runningSeconds = now.diff(start).as('seconds')

    const { exercise, offsetSeconds } = whichExercise(
      exercises,
      runningSeconds
    )

    const { rep, secondsLeft } = whichRep(
      exercise.reps,
      exercise.seconds,
      runningSeconds - offsetSeconds
    )

    return {
      active: exercise.id,
      rep,
      secondsLeft,
    }
  }
}

const secondsForAllExercises = (exercises: Exercise[]) =>
  exercises.reduce(
    (acc, curr) => acc + secondsForExercise(curr),
    0
  )

const secondsForExercise = (e: Exercise) =>
  e.reps * e.seconds

const whichExercise = (
  exercises: Exercise[],
  runningSeconds: number
) => {
  let min = 0
  let idx = 0
  while (idx < exercises.length) {
    const max = secondsForExercise(exercises[idx])
    if (runningSeconds >= min && runningSeconds < min + max)
      return {
        exercise: exercises[idx],
        offsetSeconds: min,
      }
    min += max
    idx++
  }

  throw new Error('runningSeconds out of bounds')
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

  throw new Error('whichRep out of bounds')
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('createTimer()', () => {
    describe('single exercise with reps and seconds', () => {
      const id = 'eb39b3d0-702d-4829-b67d-79a3ee7277eb'

      it('before: 1sec before', () => {
        const exercises = [
          {
            id,
            name: 'Drop Squat',
            reps: 5,
            seconds: 2,
          },
        ]
        const start = DateTime.now()
        const fakeNow = start.minus({ seconds: 1 })

        const getState = createExerciseTimer(
          exercises,
          start
        )
        const state = getState(fakeNow)

        expect(state).toEqual({ active: null })
      })

      it('during: 100ms after, first rep', () => {
        const exercises = [
          {
            id,
            name: 'Drop Squat',
            reps: 5,
            seconds: 2,
          },
        ]
        const start = DateTime.now()
        const fakeNow = start.plus(100) // ms

        const getState = createExerciseTimer(
          exercises,
          start
        )
        const state = getState(fakeNow)

        expect(state).toEqual({
          active: id,
          rep: 1,
          secondsLeft: 1.9,
        })
      })

      it('during: 3s after, second rep', () => {
        const exercises = [
          {
            id,
            name: 'Drop Squat',
            reps: 5,
            seconds: 2,
          },
        ]
        const start = DateTime.now()
        const fakeNow = start.plus({ seconds: 3 })

        const getState = createExerciseTimer(
          exercises,
          start
        )
        const state = getState(fakeNow)

        expect(state).toEqual({
          active: id,
          rep: 2,
          secondsLeft: 1,
        })
      })

      it('during: 7s after, fourth rep', () => {
        const exercises = [
          {
            id,
            name: 'Drop Squat',
            reps: 5,
            seconds: 2,
          },
        ]
        const start = DateTime.now()
        const fakeNow = start.plus({ seconds: 7 })

        const getState = createExerciseTimer(
          exercises,
          start
        )
        const state = getState(fakeNow)

        expect(state).toEqual({
          active: id,
          rep: 4,
          secondsLeft: 1,
        })
      })

      it('done: 11s after', () => {
        const exercises = [
          {
            id,
            name: 'Drop Squat',
            reps: 5,
            seconds: 2,
          },
        ]
        const start = DateTime.now()
        const fakeNow = start.plus({ seconds: 11 })

        const getState = createExerciseTimer(
          exercises,
          start
        )
        const state = getState(fakeNow)

        expect(state).toEqual({ active: null })
      })
    })

    describe('multiple exercises', () => {
      it('first exercise, first rep', () => {
        const exercises = [
          {
            id: 'eb39b3d0-702d-4829-b67d-79a3ee7277eb',
            name: 'Drop Squat',
            reps: 20,
            seconds: 2,
          },
          {
            id: 'cf894919-581b-4e5c-8421-aef5857c45c2',
            name: 'Walking Lunge',
            reps: 1,
            seconds: 30,
          },
        ]

        const start = DateTime.now()
        const fakeNow = start.plus({ seconds: 1 })

        const getState = createExerciseTimer(
          exercises,
          start
        )
        const state = getState(fakeNow)

        expect(state).toEqual({
          active: 'eb39b3d0-702d-4829-b67d-79a3ee7277eb',
          rep: 1,
          secondsLeft: 1,
        })
      })

      it('second exercise, first rep', () => {
        const exercises = [
          {
            id: 'eb39b3d0-702d-4829-b67d-79a3ee7277eb',
            name: 'Drop Squat',
            reps: 20,
            seconds: 2,
          },
          {
            id: 'cf894919-581b-4e5c-8421-aef5857c45c2',
            name: 'Walking Lunge',
            reps: 1,
            seconds: 30,
          },
        ]

        const start = DateTime.now()
        const fakeNow = start.plus({ seconds: 41 })

        const getState = createExerciseTimer(
          exercises,
          start
        )
        const state = getState(fakeNow)

        expect(state).toEqual({
          active: 'cf894919-581b-4e5c-8421-aef5857c45c2',
          rep: 1,
          secondsLeft: 29,
        })
      })
    })
  })

  describe('whichExercise()', () => {
    const exercises = [
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
    ]

    it('0 seconds', () => {
      const { exercise, offsetSeconds } = whichExercise(
        exercises,
        0
      )
      expect(exercise).toEqual(exercises[0])
      expect(offsetSeconds).toEqual(0)
    })

    it('9 seconds', () => {
      const { exercise, offsetSeconds } = whichExercise(
        exercises,
        9
      )
      expect(exercise).toEqual(exercises[0])
      expect(offsetSeconds).toEqual(0)
    })

    it('11 seconds', () => {
      const { exercise, offsetSeconds } = whichExercise(
        exercises,
        11
      )
      expect(exercise).toEqual(exercises[1])
      expect(offsetSeconds).toEqual(10)
    })

    it('41 seconds', () => {
      expect(() => whichExercise(exercises, 41)).toThrow()
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
