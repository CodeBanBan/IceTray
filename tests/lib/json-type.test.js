'use strict'

const assert = require('assert');
const IceTray = require('../../lib/main')
const JSON_MODE = IceTray.JSON_MODE
const Type = IceTray.Type

describe('IceTray Lib: JSON Type', () => {

  describe('=> Mode: Stringify', () => {
    it('should be convert object success', async () => {
      const schema = {
        jsonData: Type.JSON,
        keyNull: {
          type: Type.JSON,
          allowNull: true
        }
      }

      const rawData = {
        jsonData: {
          keyA: 'valueA',
          keyB: 'valueB',
          key9: 9
        },
        keyNull: null
      }

      const data = IceTray(schema, rawData, JSON_MODE.STRINGIFY)

      assert.strictEqual(data.keyNull, null)
      assert.strictEqual(typeof data.jsonData, 'string')
      assert.strictEqual(data.jsonData, '{"keyA":"valueA","keyB":"valueB","key9":9}')
    })

    it('should be convert array success', async () => {
      const schema = {
        dataList: Type.JSON
      }

      const rawData = {
        dataList: [1, 2, 3, 4, 5],
      }

      const data = IceTray(schema, rawData, JSON_MODE.STRINGIFY)

      assert.strictEqual(typeof data.dataList, 'string')
      assert.strictEqual(data.dataList, '[1,2,3,4,5]')
    })

    it('should not convert data when data is string', async () => {
      const schema = {
        jsonData: Type.JSON
      }

      const rawData = {
        jsonData: '{"keyA":"valueA","keyB":"valueB","key9":9}',
      }

      const data = IceTray(schema, rawData, JSON_MODE.STRINGIFY)

      assert.strictEqual(typeof data.jsonData, 'string')
      assert.strictEqual(data.jsonData, '{"keyA":"valueA","keyB":"valueB","key9":9}')
    })

    it('should be return default value when not found in raw data', async () => {
      const schema = {
        jsonData: { type: Type.JSON, default: {} }
      }

      const data = IceTray(schema, {}, JSON_MODE.STRINGIFY)

      assert.strictEqual(typeof data.jsonData, 'string')
      assert.strictEqual(data.jsonData, '{}')
    })
  })

  describe('=> Mode: Parse', () => {
    it('should be convert to object success', async () => {
      const schema = {
        jsonData: Type.JSON
      }

      const rawData = {
        jsonData: '{"keyA":"valueA","keyB":"valueB","key9":9}',
      }

      const data = IceTray(schema, rawData, JSON_MODE.PARSE)

      assert.strictEqual(typeof data.jsonData, 'object')
      assert.strictEqual(data.jsonData.keyA, 'valueA')
      assert.strictEqual(data.jsonData.keyB, 'valueB')
      assert.strictEqual(data.jsonData.key9, 9)
    })

    it('should be convert to array success', async () => {
      const schema = {
        dataList: Type.JSON
      }

      const rawData = {
        dataList: '[1,2,3,4,5]',
      }

      const data = IceTray(schema, rawData, JSON_MODE.PARSE)

      assert.strictEqual(typeof data.dataList, 'object')
      assert.strictEqual(data.dataList[0], 1)
      assert.strictEqual(data.dataList[4], 5)
    })

    it('should not convert data when data is object', async () => {
      const schema = {
        jsonData: Type.JSON
      }

      const rawData = {
        jsonData: {
          keyA: 'valueA',
          keyB: 'valueB',
          key9: 9
        },
      }

      const data = IceTray(schema, rawData, JSON_MODE.PARSE)

      assert.strictEqual(typeof data.jsonData, 'object')
      assert.strictEqual(data.jsonData.keyA, 'valueA')
      assert.strictEqual(data.jsonData.keyB, 'valueB')
      assert.strictEqual(data.jsonData.key9, 9)
    })

    it('should be return default value when not found in raw data', async () => {
      const schema = {
        jsonData: { type: Type.JSON, default: {} }
      }

      const data = IceTray(schema, {}, JSON_MODE.PARSE)

      assert.strictEqual(typeof data.jsonData, 'object')
      assert.strictEqual(Object.entries(data.jsonData).length, 0)
    })
  })

  describe('=> Mode: None', () => {
    it('should not convert object', async () => {
      const schema = {
        jsonData: Type.JSON
      }

      const rawData = {
        jsonData: {
          keyA: 'valueA',
          keyB: 'valueB',
          key9: 9
        },
      }

      const data = IceTray(schema, rawData, JSON_MODE.NONE)

      assert.strictEqual(typeof data.jsonData, 'object')
      assert.strictEqual(data.jsonData.keyA, 'valueA')
    })

    it('should not convert array', async () => {
      const schema = {
        dataList: Type.JSON
      }

      const rawData = {
        dataList: [1, 2, 3, 4, 5],
      }

      const data = IceTray(schema, rawData, JSON_MODE.NONE)

      assert.strictEqual(typeof data.dataList, 'object')
      assert.strictEqual(data.dataList.length, 5)
    })

    it('should not convert string to object', async () => {
      const schema = {
        jsonData: Type.JSON
      }

      const rawData = {
        jsonData: '{"keyA":"valueA","keyB":"valueB","key9":9}',
      }

      const data = IceTray(schema, rawData, JSON_MODE.NONE)

      assert.strictEqual(typeof data.jsonData, 'string')
      assert.strictEqual(data.jsonData, '{"keyA":"valueA","keyB":"valueB","key9":9}')
    })

    it('should not convert string to array', async () => {
      const schema = {
        dataList: Type.JSON
      }

      const rawData = {
        dataList: '[1,2,3,4,5]',
      }

      const data = IceTray(schema, rawData, JSON_MODE.NONE)

      assert.strictEqual(typeof data.dataList, 'string')
      assert.strictEqual(data.dataList, '[1,2,3,4,5]')
    })

    it('should be return default value when not found in raw data', async () => {
      const schema = {
        jsonData: { type: Type.JSON, default: {} }
      }

      const data = IceTray(schema, {}, JSON_MODE.NONE)

      assert.strictEqual(typeof data.jsonData, 'object')
      assert.strictEqual(Object.entries(data.jsonData).length, 0)
    })
  })
})
