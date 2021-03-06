'use strict'

function iceTray (ObjectSchema, rawBody) {
  if (ObjectSchema === undefined || ObjectSchema === null || rawBody === undefined || rawBody === null) {
    return (rawBody === null) ? undefined : rawBody
  }

  let result

  if (Array.isArray(rawBody)) {
    result = rawBody.map(item => _parseBody(ObjectSchema, item))
  } else {
    result = _parseBody(ObjectSchema, rawBody)
  }

  return result
}

function _parseBody (ObjectSchema, rawBody) {
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

    const rawValue = _getRawValueFromFields(rawBody, fields, defaultValue)
    if (rawValue !== undefined) {
      let value = (typeof type === 'function') ? type(rawValue) : rawValue
      data[key] = value
    }
  }

  return data
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

  return itemSchema
}

function _getRawValueFromFields (rawBody, fields, defaultValue) {
  if (rawBody === undefined) {
    return
  }

  for (let i = 0; i < fields.length; ++i) {
    const key = fields[i]
    if (rawBody[key] !== undefined) {
      return rawBody[key]
    }
  }

  return defaultValue
}

module.exports = iceTray
