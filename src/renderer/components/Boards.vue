<template>
  <div class="sidebar">
    <div class="header">
      <h3>Boards</h3>
      <button class="add-board" @click="addBoard"><fa-icon icon="plus"></fa-icon></button>
    </div>
    <draggable v-model="boards">
      <div :class="{ board: true, active: (activeBoard == index) }" v-for="(board, index) in boards" :key="index">
        <button @click="setBoardActive(index)">{{ board.name }}</button>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import AddBoardModal from '@/components/AddBoardModal.vue'

export default {
  name: 'boards',
  components: { draggable },
  computed: {
    activeBoard () {
      return this.$store.state.boards.active
    },
    boards: {
      get () {
        return this.$store.state.boards.saved
      },
      set (value) {
        this.$store.dispatch('boards/SET_SAVED', value)
      }
    }
  },
  methods: {
    addBoard () {
      this.$modal.show(AddBoardModal, {}, {
        scrollable: true,
        styles: 'background-color: #121212;',
        height: 'auto'
      })
    },
    setBoardActive (index) {
      this.$store.dispatch('boards/SET_BOARD_ACTIVE', index)
    }
  }
}
</script>

<style lang="scss">
  .sidebar {
    background-color: #121212;

    .header {
      text-align: center;
      text-transform: uppercase;
      margin: unset;
      height: 4rem;
      border-bottom: 1px solid #212121;
      display: flex;
      justify-content: center;
      align-items: center;

      h3 {
        margin: unset;
      }

      .add-board {
        border: unset;
        margin: 0 0 0 0.75rem;
        padding: unset;
        background-color: transparent;
        color: #FAFAFA;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .board {
      &.active {
        button {
          background-color: #424242;
        }
      }

      button {
        width: 100%;
        padding: 0.75rem;
        border: unset;
        background-color: #121212;
        color: #FAFAFA;

        &:hover {
          cursor: pointer;
          background-color: #323232;
        }
      }
    }
  }
</style>
