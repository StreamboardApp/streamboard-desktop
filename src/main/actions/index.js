import assert from 'assert'

var store

export default class ActionsService {
  constructor (vuexStore) {
    store = vuexStore
    this.actions = {}
  }

  registerActions (namespace, actions) {
    // During development in hot reloads this will throw
    if (process.env.NODE_ENV === 'production') {
      if (this.actions[namespace] !== undefined) {
        throw new Error(`Cannot register actions for ${namespace} as it already exists`)
      }
    }

    assert.equal(typeof namespace === 'string', true, `${namespace} is not a string`)
    actions.forEach(action => {
      assert.equal(action !== null && typeof action === 'object' && !Array.isArray(action), true, `${namespace} has an invalid action`)
      assert.equal(typeof action.id === 'string', true, `${namespace} has an action with an invalid \`id\`, expected string`)
      assert.equal(typeof action.label === 'string', true, `${namespace} has an action with an invalid \`label\`, expected string`)
      assert.equal(action.defaultIcons !== null && typeof action.defaultIcons === 'object' && !Array.isArray(action.defaultIcons), true, `${namespace} has an action with an invalid \`defaultIcons\`, expected object`)
      assert.equal(typeof action.defaultIcons.inactive === 'string', true, `${namespace} has an action with an invalid \`defaultIcons.inactive\`, expected string`)
      assert.equal(typeof action.defaultIcons.active === 'string', true, `${namespace} has an action with an invalid \`defaultIcons.active\`, expected string`)
      assert.equal(typeof action.getConfigSchema === 'function', true, `${namespace} has an action with an invalid \`getConfigSchema\`, expected function`)
      assert.equal(typeof action.execute === 'function', true, `${namespace} has an action with an invalid \`execute\`, expected a function`)
      console.log(`Registering action ${action.id} in ${namespace}`)
    });

    this.actions[namespace] = actions
    store.dispatch('application/SET_ACTIONS', Object.entries(this.actions))
  }

  unregisterActions (namespace) {
    delete this.actions[namespace]
    store.dispatch('application/SET_ACTIONS', Object.entries(this.actions))
  }

  execute (namespace, actionId, config) {
    return new Promise((resolve, reject) => {
      this.actions[namespace].forEach(action => {
        if (action.id === actionId) {
          const result = action.execute(config)
          Promise.resolve(result).then((value) => {
            resolve(value)
          }).catch((err) => {
            console.log("Error while executing action", err)
            reject()
          })
        }
      })
    })
  }

  getConfigSchema (namespace, actionId) {
    return new Promise((resolve, reject) => {
      this.actions[namespace].forEach(action => {
        if (action.id === actionId) {
          const result = action.getConfigSchema()
          Promise.resolve(result).then((value) => {
            resolve(value)
          }).catch((err) => {
            console.log("Error while getting config schema", err)
            reject()
          })
        }
      })
    })
  }
}