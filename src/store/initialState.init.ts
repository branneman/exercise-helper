//
// This script populates all empty ID's in `initialState.json`
//  with a newly generated unique uuid v4 id.
//
// Run with:
// node --loader ts-node/esm src/store/initialState.init.ts
//

// Visual boundary between node/ts/esm warnings and output
console.log('\n----------\n')

import { readFileSync, writeFileSync } from 'node:fs'
import { v4 as uuid } from 'uuid'
import { walk } from './util.js'
import { State } from '../types/state.js'

let state: State
const jsonfilepath = `${import.meta.dirname}/initialState.json`

// Read
{
  const json = readFileSync(jsonfilepath, 'utf8')
  state = JSON.parse(json)
}

// Mutate
walk(state)((obj) => {
  if (obj.id === '') obj.id = uuid()
})

// Write
{
  const json = JSON.stringify(state, null, 2)
  writeFileSync(jsonfilepath, json)
}
