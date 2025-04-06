import { Link } from 'react-router-dom'
import { Heading } from '@chakra-ui/react'

export default function Header() {
  return (
    <Link to="/">
      <Heading size="lg">Exercise Helper</Heading>
    </Link>
  )
}
