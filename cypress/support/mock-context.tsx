import { ReactElement } from 'react'
import { HashRouter } from 'react-router-dom'

export function MockContext(props: {
  children: ReactElement
}) {
  return <HashRouter>{props.children}</HashRouter>
}
