import { useState, useEffect, useRef } from 'react'
import programs from '../../store'
import { useParams } from 'react-router-dom'
import { DateTime } from 'luxon'
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
          active: null | string
          rep?: number
          secondsLeft?: number
        })
      | undefined
  } = useRef()
  useEffect(() => {
    savedTimer.current = createExerciseTimer(
      program.children[0].children,
      DateTime.now()
    )
  }, [program])

  // Update `now` every 100ms
  const [now, setNow] = useState(DateTime.now())
  useInterval(() => {
    setNow(DateTime.now())
  }, 100)

  if (!savedTimer.current)
    return <h2>Loading (no timer?!)</h2>

  const state = savedTimer.current(now)
  if (!state) return <h2>Loading (no state?!)</h2>

  const exercise = program.children[0].children.find(
    (e) => e.id === state.active
  )
  if (!exercise) return <h2>Loading (no exercise?!)</h2>

  return (
    <>
      <h2>{exercise.name}</h2>
      <h2>Seconds left: {Math.ceil(state.secondsLeft)}</h2>
    </>
  )
}
