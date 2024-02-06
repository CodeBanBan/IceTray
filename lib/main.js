'use strict'

const Type = {
  DEFAULT: 'default',
  STRING: String,
  NUMBER: Number,
  BOOLEAN: Boolean,
  DATE: Date,
  JSON: '_json_type_'
}
const JSON_MODE = {
  NONE: 0,
  STRINGIFY: 1,
  PARSE: 2
}

function iceTray (ObjectSchema, rawBody, jsonMode = JSON_MODE.NONE) {
  if (ObjectSchema === undefined || ObjectSchema === null || rawBody === undefined || rawBody === null) {
    return (rawBody === null) ? undefined : rawBody
  }

  let result

  if (Array.isArray(rawBody)) {
    result = rawBody.map(item => _parseBody(ObjectSchema, item, jsonMode))
  } else {
    result = _parseBody(ObjectSchema, rawBody, jsonMode)
  }

  return result
}

function _parseBody (ObjectSchema, rawBody, jsonMode = JSON_MODE.NONE) {
  if (rawBody === undefined) {
    return
  }

  const data = {}

  for (let key in ObjectSchema) {
    if (_isNestedSchema(ObjectSchema, key)) {
      const value = _processNestedSchema(ObjectSchema, rawBody, key)
      if (value !== undefined) {
        data[key] = value
      }
      continue
    }

    const schema = _getItemSchema(ObjectSchema, key)
    const type = schema.type
    const defaultValue = schema.default
    const fields = schema.fields
    const allowNull = schema.allowNull
    const trim = schema.trim

    const rawValue = _getRawValueFromFields(rawBody, fields, defaultValue, allowNull)
    if (rawValue !== undefined) {
      data[key] = _processValue(rawValue, type, allowNull, trim, jsonMode)
    }
  }

  return data
}

function _processValue (rawValue, type, allowNull = false, trim = false, jsonMode = JSON_MODE.NONE) {
  if (allowNull && rawValue === null) {
    return null
  }

  if (type.name !== undefined && type.name.toLowerCase() === 'string' && trim) {
    return rawValue.trim()
  }

  if (type === Type.JSON) {
    return _processJsonType(rawValue, jsonMode)
  }

  if (type.name !== undefined && type.name.toLowerCase() === 'date') {
    const value = new Date(rawValue)
    if (value.toString() === 'Invalid Date') {
      return (allowNull) ? null : new Date(0)
    }

    return value
  }

  return (typeof type === 'function') ? type(rawValue) : rawValue
}

function _processJsonType (rawValue, jsonMode = JSON_MODE.NONE) {
  if (jsonMode === JSON_MODE.STRINGIFY) {
    return (typeof rawValue === 'string') ? rawValue : JSON.stringify(rawValue)
  } else if (jsonMode === JSON_MODE.PARSE) {
    return (typeof rawValue === 'object') ? rawValue : JSON.parse(rawValue)
  }

  return rawValue
}

function _isNestedSchema (ObjectSchema, key) {
  const schema = ObjectSchema[key]
  const isNestedSchema = (typeof schema === 'object' && schema.type === undefined)

  return isNestedSchema
}

function _processNestedSchema (ObjectSchema, rawBody, key) {
  const schema = _getItemSchema(ObjectSchema, key)
  const defaultValue = schema.default
  const fields = schema.fields

  const nestedSchema = ObjectSchema[key]
  const nestedRawData = _getRawValueFromFields(rawBody, fields, defaultValue)

  let result

  if (Array.isArray(nestedSchema)) {
    if (Array.isArray(nestedRawData) === false) {
      return
    }

    const tempType = nestedSchema[0]

    if (typeof tempType === 'function') {
      // Case: Array of value
      result = nestedRawData.map(item => tempType(item))
    } else {
      // Case: Array of Object
      result = nestedRawData.map(item => _parseBody(tempType, item))
    }
  } else {
    // Case: Nested Object
    result = _parseBody(nestedSchema, nestedRawData)
  }

  return result
}

function _getItemSchema (ObjectSchema, key) {
  const typeChecker = typeof ObjectSchema[key]
  const itemSchema = (typeChecker === 'object') ? ObjectSchema[key] : { type: ObjectSchema[key] }

  itemSchema.fields = (itemSchema.fields !== undefined) ? itemSchema.fields : []
  if (typeof itemSchema.fields === 'string') {
    itemSchema.fields = [itemSchema.fields]
  }
  itemSchema.fields = [key, ...itemSchema.fields]

  itemSchema.default = (itemSchema.default !== undefined) ? itemSchema.default : undefined
  itemSchema.allowNull = (itemSchema.allowNull !== undefined) ? itemSchema.allowNull : false
  itemSchema.allowEmpty = (itemSchema.allowEmpty !== undefined) ? itemSchema.allowEmpty : false
  itemSchema.trim = (itemSchema.trim !== undefined) ? itemSchema.trim : false

  return itemSchema
}

function _getRawValueFromFields (rawBody, fields, defaultValue, allowNull = false) {
  if (rawBody === undefined) {
    return
  }

  let rawValue = defaultValue
  for (let i = 0; i < fields.length; ++i) {
    const key = fields[i]
    if (rawBody[key] !== undefined) {
      rawValue = rawBody[key]
      break
    }
  }

  if (!allowNull && rawValue === null) {
    rawValue = defaultValue
  }

  return rawValue
}

iceTray.Type = Type
iceTray.JSON_MODE = JSON_MODE
module.exports = iceTray
