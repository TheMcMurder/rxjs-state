import { createRxjsStateWithReducer } from './reducer-approach'

describe(`createRxjsStateWithReducer`, () => {
  let subs = [],
    addSub = (subscriber) => {
      subs.push(subscriber)
    }
  beforeEach(() => {
    subs.forEach((sub) => {
      sub && sub.unsubscribe && sub.unsubscribe()
    })
    subs = []
  })

  it(`should create a state stream that replays`, () => {
    const [actualValues1, fn1] = captureValuesAsTheyEmit()
    const [actualValues2, fn2] = captureValuesAsTheyEmit()
    const [state$, fireEvent] = createRxjsStateWithReducer({
      reducerFn,
      initialValue: 0,
    })
    addSub(state$.subscribe(fn1))
    fireEvent({ type: 'ADD', payload: 2 })
    fireEvent({ type: 'ADD', payload: 1 })
    fireEvent({ type: 'RESET' })
    fireEvent({ type: 'ADD', payload: 1 })
    fireEvent({ type: 'RESET' })
    fireEvent({ type: 'SET', payload: 4 })
    addSub(state$.subscribe(fn2))
    fireEvent({ type: 'SUBTRACT', payload: 5 })
    fireEvent({ type: 'SET', payload: 16 })
    fireEvent({ type: 'SUBTRACT', payload: 5 })
    const expectedValues1 = [0, 2, 3, 0, 1, 0, 4, -1, 16, 11]
    const expectedValues2 = [4, -1, 16, 11]
    return new Promise((r) => {
      setTimeout(() => {
        expect(actualValues1).toStrictEqual(expectedValues1)
        expect(actualValues2).toStrictEqual(expectedValues2)
        r()
      }, 250)
    })
  })

  it(`should create a stream that doesn't replay`, () => {
    const [actualValues1, fn1] = captureValuesAsTheyEmit()
    const [actualValues2, fn2] = captureValuesAsTheyEmit()
    const [state$, fireEvent] = createRxjsStateWithReducer({
      reducerFn,
      replay: false,
    })
    addSub(state$.subscribe(fn1))
    fireEvent({ type: 'ADD', payload: 2 })
    fireEvent({ type: 'ADD', payload: 1 })
    fireEvent({ type: 'RESET' })
    fireEvent({ type: 'ADD', payload: 1 })
    fireEvent({ type: 'RESET' })
    fireEvent({ type: 'SET', payload: 4 })
    const expectedValues1 = [0, 2, 3, 0, 1, 0, 4]
    // const expectedValues2 = [4, -1, 16, 11]
    return new Promise((r) => {
      setTimeout(() => {
        expect(actualValues1).toStrictEqual(expectedValues1)
        // expect(actualValues2).toStrictEqual(expectedValues2)
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

function captureValuesAsTheyEmit() {
  const captureArray = []
  const fn = (v) => captureArray.push(v)
  return [captureArray, fn]
}
