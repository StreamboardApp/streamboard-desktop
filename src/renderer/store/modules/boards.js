const state = {
  saved: [],
  active: 0
}

const mutations = {
  SAVED (state, data) {
    state.saved = data
  },
  BUTTON_ACTION (state, data) {
    state.saved[state.active].structure[data.row][data.column].action = data.action
    state.saved[state.active].structure[data.row][data.column].actionNamespace = data.actionNamespace
    state.saved[state.active].structure[data.row][data.column].defaultIcons.inactive = data.defaultIcons.inactive
    state.saved[state.active].structure[data.row][data.column].defaultIcons.active = data.defaultIcons.active
  },
  BUTTON_CONFIG (state, data) {
    if (state.saved[state.active].structure[data.row][data.column].config === null || state.saved[state.active].structure[data.row][data.column].config === undefined) {
      state.saved[state.active].structure[data.row][data.column].config = {}
    }

    state.saved[state.active].structure[data.row][data.column].config[data.id] = data.value
  },
  BUTTON_STATE (state, data) {
    state.saved[state.active].structure[data.row][data.column].state = data.state
  },
  BUTTON_ICON (state, data) {
    state.saved[state.active].structure[data.row][data.column].icons[data.type] = data.src
  },
  SWAP_BUTTONS (state, data) {
    var source = state.saved[state.active].structure[data.source.row][data.source.column]
    var destination = state.saved[state.active].structure[data.destination.row][data.destination.column]

    state.saved[state.active].structure[data.source.row][data.source.column] = destination
    state.saved[state.active].structure[data.destination.row][data.destination.column] = source
  },
  BOARD_ACTIVE (state, data) {
    state.active = data
  },
  ADD_BOARD (state, data) {
    state.saved.push(data)
  },
  DELETE_BOARD (state, data) {
    // Disallow deleting all boards
    if (state.saved.length > 1) {
      state.saved.splice(data, 1)
    }
  }
}

const actions = {
  SET_SAVED ({ commit }, data) {
    commit('SAVED', data)
  },
  SET_BUTTON_ACTION ({ commit }, data) {
    commit('BUTTON_ACTION', data)
  },
  SET_BUTTON_CONFIG ({ commit }, data) {
    commit('BUTTON_CONFIG', data)
  },
  SET_BUTTON_STATE ({ commit }, data) {
    commit('BUTTON_STATE', data)
  },
  SET_BUTTON_ICON ({ commit }, data) {
    commit('BUTTON_ICON', data)
  },
  SWAP_BUTTONS ({ commit }, data) {
    commit('SWAP_BUTTONS', data)
  },
  SET_BOARD_ACTIVE ({ commit }, data) {
    commit('BOARD_ACTIVE', data)
  },
  ADD_BOARD ({ commit }, data) {
    commit ('ADD_BOARD', data)
  },
  DELETE_BOARD ({ commit }, data) {
    commit ('DELETE_BOARD', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
