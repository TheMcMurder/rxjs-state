import { createRxjsStateWithReducer } from './reducer-approach'

describe(`createRxjsStateWithReducer`, () => {
  let sub
  beforeEach(() => {
    sub && sub.unsubscribe && sub.unsubscribe()
  })

  it(`should create a state stream`, () => {
    const [state$, fireEvent] = createRxjsStateWithReducer({
      reducerFn,
      initialValue: 0,
    })
    const expectedValues = [0, 2, 3, 0, 1, 0, 4, -1, 16, 11]
    const actualValues = []
    sub = state$.subscribe((v) => {
      actualValues.push(v)
    })
    fireEvent({ type: 'ADD', payload: 2 })
    fireEvent({ type: 'ADD', payload: 1 })
    fireEvent({ type: 'RESET' })
    fireEvent({ type: 'ADD', payload: 1 })
    fireEvent({ type: 'RESET' })
    fireEvent({ type: 'SET', payload: 4 })
    fireEvent({ type: 'SUBTRACT', payload: 5 })
    fireEvent({ type: 'SET', payload: 16 })
    fireEvent({ type: 'SUBTRACT', payload: 5 })
    return new Promise((r) => {
      setTimeout(() => {
        expect(actualValues).toStrictEqual(expectedValues)
        r()
      }, 250)
    })
  })
})

function reducerFn(acc, value) {
  const { type, payload } = value
  switch (type) {
    case 'RESET':
      return 0
    case 'ADD':
      return acc + payload
    case 'SUBTRACT':
      return acc - payload
    case 'SET':
      return payload
  }
}
