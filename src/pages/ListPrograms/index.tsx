import programs from '../../store'
import { Link } from 'react-router-dom'

export default function ListPrograms() {
  return (
    <>
      <h2>Exercise Programs</h2>
      <ol>
        {programs.map((program) => (
          <li key={program.id}>
            <Link to={`/program/${program.id}`}>
              {program.name}
            </Link>
          </li>
        ))}
      </ol>
    </>
  )
}
