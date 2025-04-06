import { Link } from 'react-router-dom'
import { Box, Heading, List } from '@chakra-ui/react'

import programs from '../../store'

export default function ListPrograms() {
  return (
    <Box m="1em 0 0 0">
      <Heading size="lg" mb="1em">
        Exercise Programs
      </Heading>
      <List.Root>
        {programs.map((program) => (
          <List.Item key={program.id}>
            <Link to={`/program/${program.id}`}>
              {program.name}
            </Link>
          </List.Item>
        ))}
      </List.Root>
    </Box>
  )
}
