const state = {
  firstRun: true,
  plugins: [],
  actions: []
}

const mutations = {
  FIRST_RUN (state, data) {
    state.firstRun = data
  },
  PLUGINS (state, data) {
    state.plugins = data
  },
  ACTIONS (state, data) {
    state.actions = data
  }
}

const actions = {
  SET_FIRST_RUN ({ commit }, data) {
    commit('FIRST_RUN', data)
  },
  SET_PLUGINS ({ commit }, data) {
    commit('PLUGINS', data)
  },
  SET_ACTIONS ({ commit }, data) {
    commit('ACTIONS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
