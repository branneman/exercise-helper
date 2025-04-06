import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { DateTime } from 'luxon'
import { Box, Heading } from '@chakra-ui/react'

import type { Group, Exercise } from '../../types/state'
import programs from '../../store'
import useInterval from '../../hooks/useInterval'
import { createExerciseTimer } from './timers'

export default function RunProgram() {
  const { id } = useParams()
  const program = programs.find((p) => p.id === id)

  if (!program)
    return (
      <Heading size="lg" mt="1em">
        Program not found
      </Heading>
    )

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
      DateTime.now(),
    )
  }, [program])

  // Update `now` every 100ms
  const [now, setNow] = useState(DateTime.now())
  useInterval(() => {
    setNow(DateTime.now())
  }, 100)

  if (!savedTimer.current)
    return (
      <Heading size="lg" mt="1em">
        Loading (no timer)
      </Heading>
    )

  const state = savedTimer.current(now)
  if (
    !state ||
    !state.active ||
    !state.group ||
    !state.exercise ||
    !state.exercise.id
  )
    return (
      <Heading size="lg" mt="1em">
        Loading (no state)
      </Heading>
    )

  const exercise = state.group.children.find(
    (e) => e.id === state.exercise.id,
  )
  if (!exercise || !state.secondsLeft)
    return (
      <Heading size="lg" mt="1em">
        Loading (no exercise)
      </Heading>
    )

  return (
    <Box m="1em 0 0 0">
      <Heading size="lg" mb="1em">
        {exercise.name}
        {exercise.reps > 1
          ? ` × ${state.rep}/${exercise.reps}`
          : null}
      </Heading>
      <Heading size="lg">
        Seconds left: {Math.ceil(state.secondsLeft)}
      </Heading>
    </Box>
  )
}
