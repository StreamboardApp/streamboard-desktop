<template>
  <div class="page">
    <modals-container></modals-container>
    <boards class="boards"></boards>
    <div class="board-container">
      <div class="menu-bar">
        <h1 class="header">{{ this.$store.state.boards.saved[this.$store.state.boards.active].name }}</h1>
        <button class="delete-board" @click="deleteBoard"><fa-icon icon="trash"></fa-icon></button>
      </div>
      <board class="board" :board="this.$store.state.boards.saved[this.$store.state.boards.active]"></board>
    </div>
    <actions class="actions"></actions>
  </div>
</template>

<script>
import Boards from '@/components/Boards.vue'
import Board from '@/components/Board.vue'
import Actions from '@/components/Actions.vue'

export default {
  name: 'main-page',
  components: { Boards, Board, Actions },
  methods: {
    deleteBoard () {
      this.$store.dispatch('boards/DELETE_BOARD', this.$store.state.boards.active)
    }
  }
}
</script>

<style lang="scss">
  .page {
    display: flex;
    height: 100%;

    .boards {
      flex: 1;
    }

    .board-container {
      flex: 3;

      .menu-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #121212;
        height: 4rem;

        .header {
          text-align: center;
          margin: unset;
        }

        .delete-board {
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
        height: calc(100% - 4rem);
      }
    }

    .actions {
      flex: 1;
    }
  }
</style>
