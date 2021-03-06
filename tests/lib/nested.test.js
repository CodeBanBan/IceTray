'use strict'

const assert = require('chai').assert
const IceTray = require('../../lib/main')

describe('IceTray Lib: Nested Schema', () => {
  it('should be success with simple nested schema', async () => {
    const schema = {
      id: String,
      profile: {
        firstName: String,
        lastName: String,
        midName: String,
        age: Number
      },
      hobbies: [String],
      exp: [{
        title: String,
        total: Number
      }],
      married: Boolean
    }

    const rawData = {
      id: 123456,
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        midName: 5,
        age: '35'
      },
      hobbies: ['movies', 'music', true, false, 55],
      exp: [
        {
          title: 999,
          total: '3.5'
        },
        {
          title: '555',
          total: 2.23
        }
      ],
      married: 0
    }

    const result = IceTray(schema, rawData)
    const profile = result.profile
    const hobbies = result.hobbies
    const exp = result.exp

    assert.strictEqual(result.id, '123456')
    assert.strictEqual(result.married, false)

    assert.strictEqual(profile.firstName, 'John')
    assert.strictEqual(profile.lastName, 'Doe')
    assert.strictEqual(profile.midName, '5')
    assert.strictEqual(profile.age, 35)

    assert.strictEqual(hobbies.length, 5)
    assert.strictEqual(hobbies[0], 'movies')
    assert.strictEqual(hobbies[1], 'music')
    assert.strictEqual(hobbies[2], 'true')
    assert.strictEqual(hobbies[3], 'false')
    assert.strictEqual(hobbies[4], '55')

    assert.strictEqual(exp.length, 2)
    assert.strictEqual(exp[0].title, '999')
    assert.strictEqual(exp[0].total, 3.5)
    assert.strictEqual(exp[1].title, '555')
    assert.strictEqual(exp[1].total, 2.23)
  })

  it('should be success with full option nested schema', async () => {
    const schema = {
      profile: {
        name: {
          firstName: {
            type: String,
            fields: ['name']
          },
          lastName: {
            type: String,
            default: 'default-lastname'
          }
        },
        age: Number
      }
    }

    const rawData = {
      profile: {
        name: {
          name: 'field-name'
        },
        age: '35'
      }
    }

    const {profile} = IceTray(schema, rawData)

    assert.strictEqual(profile.name.firstName, 'field-name')
    assert.strictEqual(profile.name.lastName, 'default-lastname')
    assert.strictEqual(profile.age, 35)
  })

  it('should be success with full option nested schema with manual field', async () => {
    const schema = {
      profile: {
        fields: 'profile_manual',
        name: {
          firstName: {
            type: String,
            fields: ['name']
          },
          lastName: {
            type: String,
            default: 'default-lastname'
          }
        },
        age: Number
      }
    }

    const rawData = {
      profile_manual: {
        name: {
          name: 'field-name'
        },
        age: '35'
      }
    }

    const {profile} = IceTray(schema, rawData)

    assert.strictEqual(profile.name.firstName, 'field-name')
    assert.strictEqual(profile.name.lastName, 'default-lastname')
    assert.strictEqual(profile.age, 35)
  })

  it('should be success with full option nested schema with default value', async () => {
    const schema = {
      account: {
        fields: 'account_manual',
        default: {
          username: 'default-username',
          password: 'default-password'
        },
        username: String,
        password: String
      },
      profile: {
        fields: 'profile_manual',
        default: {
          name: {
            firstName: 'default-firstname',
            lastName: 'default-lastname'
          },
          age: 999
        },
        name: {
          firstName: String,
          lastName: String
        },
        age: Number
      }
    }

    const rawData = {
      account_manual: {
        username: 'raw-username',
        password: 'raw-password'
      }
    }

    const {account, profile} = IceTray(schema, rawData)

    assert.strictEqual(account.username, 'raw-username')
    assert.strictEqual(account.password, 'raw-password')

    assert.strictEqual(profile.name.firstName, 'default-firstname')
    assert.strictEqual(profile.name.lastName, 'default-lastname')
    assert.strictEqual(profile.age, 999)
  })

  it('should not return key when row data no key', async () => {
    const schema = {
      hobbies: [String],
      exp: [{
        title: String,
        total: Number
      }]
    }

    const rawData = {
      exp: []
    }

    const result = IceTray(schema, rawData)

    assert.notProperty(result, 'hobbies')
    assert.strictEqual(result.exp.length, 0)
  })

  it('should not return key not exist', async () => {
    const schema = {
      username: String,
      profile: {
        firstName: String,
        lastName: String
      }
    }

    const rawData = {
      username: 'demo'
    }

    const result = IceTray(schema, rawData)

    assert.strictEqual(result.username, 'demo')
    assert.notProperty(result, 'profile')
  })
})
