import { Link, useParams } from 'react-router-dom'
import { Box, Heading, List } from '@chakra-ui/react'

import { Exercise } from '../../types/state'
import programs from '../../store'

export default function ViewProgram() {
  const { id } = useParams()
  const program = programs.find((p) => p.id === id)

  if (!program)
    return (
      <Heading size="lg" mt="1em">
        Program not found
      </Heading>
    )

  return (
    <Box m="1em 0 0 0">
      <Heading size="lg" mb="1em">
        <Link to={`/run/${program.id}`}>
          {program.name}
        </Link>
      </Heading>
      <List.Root>
        {program.children.map((group) => (
          <List.Item key={group.id} mb="1em">
            <Heading size="md">{group.name}</Heading>
            <List.Root>
              {group.children.map((exercise) => (
                <List.Item key={exercise.id}>
                  <ExerciseInfo exercise={exercise} />
                </List.Item>
              ))}
            </List.Root>
          </List.Item>
        ))}
      </List.Root>
    </Box>
  )
}

export function ExerciseInfo(props: {
  exercise: Exercise
}) {
  const { exercise } = props

  const additionals = []
  if (exercise.sets && exercise.sets > 1)
    additionals.push('sets: ' + exercise.sets)
  if (exercise.reps && exercise.reps > 1)
    additionals.push('reps: ' + exercise.reps)
  if (exercise.seconds && exercise.seconds > 1)
    additionals.push('seconds: ' + exercise.seconds)

  return (
    <>
      {exercise.name}{' '}
      {additionals.length > 0 &&
        `(${additionals.join(', ')})`}
    </>
  )
}
