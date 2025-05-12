import { ReactElement } from 'react'
import { HashRouter } from 'react-router-dom'
import { Provider } from '../../src/ui/provider'

export function MockContext(props: {
  children: ReactElement
}) {
  return (
    <Provider>
      <HashRouter>{props.children}</HashRouter>
    </Provider>
  )
}
