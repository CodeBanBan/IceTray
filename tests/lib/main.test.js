'use strict'

const assert = require('assert');
const IceTray = require('../../lib/main')

describe('IceTray Lib', () => {
  it('should be success with true type in simple schema', async () => {
    const schema = {
      string: String,
      number: Number
    }

    const rawData = {
      string: 123,
      number: '33'
    }

    const data = IceTray(schema, rawData)

    assert.strictEqual(typeof data.string, 'string')
    assert.strictEqual(typeof data.number, 'number')

    assert.strictEqual(data.string, '123')
    assert.strictEqual(data.number, 33)
  })

  it('should be return default value when not found in raw data', async () => {
    const schema = {
      string: { type: String, default: 'default-value' },
      number: { type: Number, default: 9999 }
    }

    const data = IceTray(schema, {})

    assert.strictEqual(typeof data.string, 'string')
    assert.strictEqual(typeof data.number, 'number')

    assert.strictEqual(data.string, 'default-value')
    assert.strictEqual(data.number, 9999)
  })

  it('should be return default value when default is empty or 0 value', async () => {
    const schema = {
      string: { type: String, default: '' },
      number: { type: Number, default: 0 }
    }

    const data = IceTray(schema, {})

    assert.strictEqual(typeof data.string, 'string')
    assert.strictEqual(typeof data.number, 'number')

    assert.strictEqual(data.string, '')
    assert.strictEqual(data.number, 0)
  })

  it('should be return value from same key', async () => {
    const schema = {
      string: { type: String, fields: ['s', 'st', 'str'] },
      number: { type: Number, fields: 'num' }
    }

    const rawData = {
      string: 'original-string',
      st: 'from-fields-st',
      number: 999,
      num: 555
    }

    const data = IceTray(schema, rawData)

    assert.strictEqual(typeof data.string, 'string')
    assert.strictEqual(typeof data.number, 'number')

    assert.strictEqual(data.string, 'original-string')
    assert.strictEqual(data.number, 999)
  })

  it('should be return value from map fields when missing original key', async () => {
    const schema = {
      string: { type: String, fields: ['s', 'st', 'str'] },
      number: { type: Number, fields: 'num' }
    }

    const rawData = {
      st: 'from-fields-st',
      num: 555
    }

    const data = IceTray(schema, rawData)

    assert.strictEqual(typeof data.string, 'string')
    assert.strictEqual(typeof data.number, 'number')

    assert.strictEqual(data.string, 'from-fields-st')
    assert.strictEqual(data.number, 555)
  })

  it('should be return default when not found map fields', async () => {
    const schema = {
      string: { type: String, fields: ['s', 'st', 'str'], default: 'default-value' },
      number: { type: Number, fields: 'num', default: 123456 }
    }

    const rawData = {
      st_not_found: 'from-fields-st',
      num_not_found: 555
    }

    const data = IceTray(schema, rawData)

    assert.strictEqual(typeof data.string, 'string')
    assert.strictEqual(typeof data.number, 'number')

    assert.strictEqual(data.string, 'default-value')
    assert.strictEqual(data.number, 123456)
  })

  it('should be return array data when raw data is array', async () => {
    const schema = {
      string: String,
      number: Number
    }

    const rawData = [
      {
        string: 'string-0',
        number: 0
      },
      {
        string: 'string-1',
        number: 1
      },
      {
        string: 'string-2',
        number: 2
      }
    ]

    const dataList = IceTray(schema, rawData)

    assert.strictEqual(typeof dataList[0].string, 'string')
    assert.strictEqual(typeof dataList[0].number, 'number')

    assert.strictEqual(dataList.length, 3)
    assert.strictEqual(dataList[1].string, 'string-1')
    assert.strictEqual(dataList[1].number, 1)
  })
})
