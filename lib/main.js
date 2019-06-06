'use strict'

function iceTray (ObjectSchema, rawBody) {
  if (ObjectSchema === undefined || rawBody === undefined) {
    return rawBody
  }

  let result

  if (Array.isArray(rawBody)) {
    result = []
    for (let i = 0; i < rawBody.length; ++i) {
      const item = _parseBody(ObjectSchema, rawBody[i])
      result.push(item)
    }
  } else {
    result = _parseBody(ObjectSchema, rawBody)
  }

  return result
}

function _parseBody (ObjectSchema, rawBody) {
  const data = {}

  for (let key in ObjectSchema) {
    const schema = _getItemSchema(ObjectSchema, key)

    const type = schema.type
    const defaultValue = schema.default
    const fields = schema.fields

    const rawValue = _getRawValueFromFields(rawBody, fields, defaultValue)
    if (rawValue !== undefined) {
      let value = (type === 'default') ? rawValue : type(rawValue)

      // switch (type) {
      //   case 'number': value = Number(rawValue); break
      //   case 'string': value = String(rawValue); break
      //   default: value = rawValue
      // }

      data[key] = value
    }
  }

  return data
}

function _getItemSchema (ObjectSchema, key) {
  const typeChecker = typeof ObjectSchema[key]
  const itemSchema = (typeChecker === 'object') ? ObjectSchema[key] : { type: ObjectSchema[key] }

  itemSchema.fields = (itemSchema.fields !== undefined) ? itemSchema.fields : [key]
  if (typeof itemSchema.fields === 'string') {
    itemSchema.fields = [itemSchema.fields]
  }

  itemSchema.default = (itemSchema.default !== undefined) ? itemSchema.default : undefined

  return itemSchema
}

function _getRawValueFromFields (rawBody, fields, defaultValue) {
  for (let i = 0; i < fields.length; ++i) {
    const key = fields[i]
    if (rawBody[key] !== undefined) {
      return rawBody[key]
    }
  }

  return defaultValue
}

module.exports = iceTray
