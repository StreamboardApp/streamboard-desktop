<template>
  <div class="sidebar">
    <h3 class="header">Boards</h3>
    <ul>
      <li :class="{ board: true, active: (activeBoard == index) }" v-for="(board, index) in this.$store.state.boards.saved" :key="index"><button>{{ board.name }}</button></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'boards',
  computed: {
    activeBoard () {
      return this.$store.state.boards.active
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
      line-height: 4rem;
      margin: unset;
      height: 4rem;
      border-bottom: 1px solid #212121;
    }

    ul {
      list-style: none;
      padding: unset;
      margin: unset;

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
  }
</style>
