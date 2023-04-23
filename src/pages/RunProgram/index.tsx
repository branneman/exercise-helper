import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { DateTime } from 'luxon'

import type { Group, Exercise } from '../../types/state'
import programs from '../../store'
import useInterval from '../../hooks/useInterval'
import { createExerciseTimer } from './timers'

export default function RunProgram() {
  const { id } = useParams()
  const program = programs.find((p) => p.id === id)

  if (!program) return <h2>Program not found</h2>

  // Create new timer just once
  const savedTimer: {
    current:
      | ((now: DateTime) => {
          active: boolean
          group?: Group
          exercise?: Exercise
          rep?: number
          secondsLeft?: number
        })
      | undefined
  } = useRef()
  useEffect(() => {
    savedTimer.current = createExerciseTimer(
      program,
      DateTime.now()
    )
  }, [program])

  // Update `now` every 100ms
  const [now, setNow] = useState(DateTime.now())
  useInterval(() => {
    setNow(DateTime.now())
  }, 100)

  if (!savedTimer.current)
    return <h2>Loading (no timer)</h2>

  const state = savedTimer.current(now)
  if (
    !state ||
    !state.active ||
    !state.group ||
    !state.exercise ||
    !state.exercise.id
  )
    return <h2>Loading (no state)</h2>

  const exercise = state.group.children.find(
    (e) => e.id === state.exercise.id
  )
  if (!exercise || !state.secondsLeft)
    return <h2>Loading (no exercise)</h2>

  return (
    <>
      <h2>
        {exercise.name}
        {exercise.reps > 1
          ? ` × ${state.rep}/${exercise.reps}`
          : null}
      </h2>
      <h2>Seconds left: {Math.ceil(state.secondsLeft)}</h2>
    </>
  )
}
