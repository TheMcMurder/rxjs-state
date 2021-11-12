import * as rxjsState from './rxjs-state.js'

describe('API structure', () => {
  it(`should export a string value under the key foo`, () => {
    const { foo } = rxjsState
    expect(foo).toBeDefined()
    expect(typeof(foo)).toBe('string')


  })
})