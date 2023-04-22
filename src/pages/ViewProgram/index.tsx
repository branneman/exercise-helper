import { Exercise } from '../../types/state'
import programs from '../../store'
import { Link, useParams } from 'react-router-dom'

export default function ViewProgram() {
  const { id } = useParams()
  const program = programs.find((p) => p.id === id)

  if (!program) return <h2>Program not found</h2>

  return (
    <>
      <h2>
        <Link to={`/run/${program.id}`}>
          {program.name}
        </Link>
      </h2>
      <ol>
        {program.children.map((group) => (
          <li key={group.id}>
            <h3>{group.name}</h3>
            <ol>
              {group.children.map((exercise) => (
                <li key={exercise.id}>
                  <ExerciseInfo exercise={exercise} />
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </>
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
