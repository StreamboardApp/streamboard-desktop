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

    this.actions[namespace] = actions
    store.dispatch('application/SET_ACTIONS', Object.entries(this.actions))
  }

  unregisterActions (namespace) {
    delete this.actions[namespace]
  }

  execute (namespace, actionId, config) {
    return new Promise((resolve, reject) => {
      this.actions[namespace].forEach(action => {
        if (action.id === actionId) {
          const result = action.execute(config)
          Promise.resolve(result).then((value) => {
            resolve(value)
          }).catch((err) => {
            console.log(err)
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
            console.log(value)
            resolve(value)
          }).catch(() => {
            reject()
          })
        }
      })
    })
  }
}