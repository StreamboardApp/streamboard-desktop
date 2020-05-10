<template>
  <div class="page">
    <modals-container></modals-container>
    <boards class="boards"></boards>
    <div class="board-container">
      <div class="menu-bar">
        <h1 class="header">{{ this.$store.state.boards.saved[this.$store.state.boards.active].name }}</h1>
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
  components: { Boards, Board, Actions }
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
        background-color: #121212;
        height: 4rem;

        .header {
          text-align: center;
          line-height: 4rem;
          margin: unset;
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
