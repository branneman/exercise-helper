import programs from '../../store'

export default function ListPrograms() {
  return (
    <ol>
      {programs.map((program) => (
        <li key={program.id}>{program.name}</li>
      ))}
    </ol>
  )
}
