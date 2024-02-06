'use strict'

const assert = require('assert');
const IceTray = require('../../lib/main')
const Type = IceTray.Type

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

  it('should be return undefined when raw data is null', async () => {
    const schema = {
      string: String,
      number: Number
    }

    const rawData = null

    const data = IceTray(schema, rawData)

    assert.strictEqual(data, undefined)
  })

  it('should be return undefined when raw data is undefined', async () => {
    const schema = {
      string: String,
      number: Number
    }

    const rawData = undefined

    const data = IceTray(schema, rawData)

    assert.strictEqual(data, undefined)
  })

  it('should be return raw data when schema is null or undefined', async () => {
    const undefinedSchema = undefined
    const nullSchema = null

    const rawData = {
      a: 5
    }

    const dataByUndefinedSchema = IceTray(undefinedSchema, rawData)
    assert.strictEqual(dataByUndefinedSchema.a, 5)

    const dataByNullSchema = IceTray(nullSchema, rawData)
    assert.strictEqual(dataByNullSchema.a, 5)
  })

  it('should be return null when is allow null', async () => {
    const schema = {
      string: { type: String, default: '', allowNull: true },
      number: { type: Number, default: 0, allowNull: true  }
    }

    const data = IceTray(schema, {
      string: null,
      number: null
    })

    assert.strictEqual(data.string, null)
    assert.strictEqual(data.number, null)
  })

  it('should be return default value when field is not set allow null', async () => {
    const schema = {
      a: { type: String, default: 'default-value', allowNull: true },
      b: { type: String, default: 'default-value', allowNull: false },
      c: { type: Number, default: 99999 },
      d: { type: Number, default: 99999, allowNull: true },
      x: { type: String, default: 99999, allowNull: true }
    }

    const data = IceTray(schema, {
      a: null,
      b: null,
      c: null,
      d: null,
      x: 1111
    })

    assert.strictEqual(data.a, null)
    assert.strictEqual(data.b, 'default-value')
    assert.strictEqual(data.c, 99999)
    assert.strictEqual(data.d, null)
    assert.strictEqual(data.x, '1111')
  })

  it('should return trimmed value when field is set to trim', async () => {
    const schema = {
      a: { type: String, default: 'default-value', trim: true, },
      b: { type: String, default: 'default-value', trim: false },
      c: { type: String, default: 'default-value'},
    }

      const data = IceTray(schema, {
        a: '      Should Trim     ',
        b: 'NotTrim  ',
        c: 'NotTrim  ',
      })

    assert.strictEqual(data.a, 'Should Trim')
    assert.strictEqual(data.b, 'NotTrim  ')
    assert.strictEqual(data.c, 'NotTrim  ')
  })

  it('should be success with type date', async () => {
    const MOCK_UNIX_TIME = 1640995200000 // 2022-01-01 00:00:00 UTC+0
    const schema = {
      key1: Type.DATE,
      key2: Type.DATE,
      key3: Type.DATE,
      key4: Type.DATE,
      key5: Type.DATE,
      key6: Type.DATE,
      key7: {
        type: Type.DATE,
        allowNull: true
      },
      key8: {
        type: Type.DATE,
        allowNull: true
      },
      key9: {
        type: Type.DATE,
        default: MOCK_UNIX_TIME
      },
      key10: {
        type: Type.DATE,
        default: MOCK_UNIX_TIME
      }
    }

    const rawData = {
      key1: MOCK_UNIX_TIME,  // 2022-01-01 00:00:00 UTC+0
      key2: '2022-01-01 00:00:00 UTC+0',
      key3: '',
      key4: 'invalid format',
      key5: undefined,
      key6: null,
      key7: '',
      key8: 'invalid format',
      key9: null,
      key10: 'invalid format'
    }

    const data = IceTray(schema, rawData)

    assert.strictEqual(data.key1 instanceof Date, true)
    assert.strictEqual(data.key2 instanceof Date, true)
    assert.strictEqual(data.key3 instanceof Date, true)
    assert.strictEqual(data.key4 instanceof Date, true)
    assert.strictEqual(data.key1.valueOf(), MOCK_UNIX_TIME)
    assert.strictEqual(data.key2.valueOf(), MOCK_UNIX_TIME)
    assert.strictEqual(data.key3.valueOf(), 0)
    assert.strictEqual(data.key4.valueOf(), 0)

    assert.strictEqual(data.key5, undefined)
    assert.strictEqual(data.key6, undefined)
    assert.strictEqual(data.key7, null)
    assert.strictEqual(data.key8, null)

    assert.strictEqual(data.key9 instanceof Date, true)
    assert.strictEqual(data.key10 instanceof Date, true)
    assert.strictEqual(data.key9.valueOf(), MOCK_UNIX_TIME)
    assert.strictEqual(data.key10.valueOf(), 0)
  })
})
