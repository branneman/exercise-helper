import { cy, describe, it } from 'local-cypress'
import { MockContext } from '../../../cypress/support/mock-context'
import ListPrograms from './index'

describe('<ListPrograms />', () => {
  it('renders', () => {
    cy.mount(
      <MockContext>
        <ListPrograms />
      </MockContext>
    )
  })
})
