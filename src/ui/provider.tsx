import {
  ChakraProvider,
  defaultSystem,
} from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'

export function Provider(props: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider forcedTheme="dark" attribute="class">
      <ChakraProvider value={defaultSystem}>
        {props.children}
      </ChakraProvider>
    </ThemeProvider>
  )
}
