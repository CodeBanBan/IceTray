'use strict'

const assert = require('assert');
const Main = require('../../lib/main')

describe('Lib: Main', () => {
  it('should be return "hello"', async () => {
    const result = Main.sayHello()

    assert.strictEqual(result, 'hello')
  })
})
