<template>
  <div class="container">
    <h3 class="header">Add Board</h3>
    <label class="label">Name</label>
    <input type="text" maxlength="255" v-model="name">
    <label class="label">Grid Size</label>
    <div>
      <input type="number" min="1" max="12" v-model="gridX">
      <fa-icon icon="times"></fa-icon>
      <input type="number" min="1" max="12" v-model="gridY">
    </div>
    <!--<select v-if="inputSchema.type === 'dropdown'" :value="config[inputSchema.id]" @change="configChanged($event, inputSchema.id)">
      <option v-for="(option, optionIndex) in inputSchema.values" :key="optionIndex" :value="option.value">{{ option.name }}</option>
    </select>-->
    <button class="add" @click="addBoard()">Add Board</button>
  </div>
</template>

<script>
export default {
  name: 'add-board-modal',
  data () {
    return {
      name: '',
      gridX: 5,
      gridY: 3
    }
  },
  methods: {
    addBoard () {
      if (this.name.trim() !== '' && this.gridX >= 1 && this.gridX <= 12 && this.gridY >= 1 && this.gridY <= 12) {
        var newBoard = []
        for (var y = 0; y < this.gridY; y++) {
          newBoard[y] = []
          for (var x = 0; x < this.gridX; x++) {
            newBoard[y][x] = {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              },
              defaultIcons: {
                inactive: '',
                active: ''
              }
            }
          }
        }

        this.$store.dispatch('boards/ADD_BOARD', {
          name: this.name,
          structure: newBoard
        })

        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .label:not(:first-of-type) {
      margin-top: 1rem;
    }

    .header {
      margin-top: unset;
      text-transform: uppercase;
    }

    .add {
      margin-top: 1rem;
      padding: 0.75rem;
      border: unset;
      background-color: #2196F3;
      color: #FAFAFA;

      &:hover {
        cursor: pointer;
        background-color: #1976D2;
      }
    }
  }
</style>