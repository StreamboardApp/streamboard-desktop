<template>
  <div class="container">
    <div class="grid">
      <div class="row" v-for="(row, rowIndex) in board.structure" :key="rowIndex">
        <div class="column" v-for="(column, columnIndex) in row" :key="columnIndex">
          <button @click="configureButton(rowIndex, columnIndex)" @contextmenu="executeButton(rowIndex, columnIndex)" @dragstart="buttonDragStart($event, rowIndex, columnIndex)" @dragover="buttonDragOver($event)" @dragenter="buttonDragEnter($event, rowIndex, columnIndex)" @dragleave="buttonDragLeave($event)" @drop="buttonDragDrop($event, rowIndex, columnIndex)" :class="{ button: true, active: column.state }" >
            <img v-if="!column.state && column.icons.inactive.trim() !== ''" class="icon" :src="column.icons.inactive">
            <img v-if="column.state && column.icons.active.trim() !== ''" class="icon" :src="column.icons.active">

            <fa-icon class="default-icon" v-if="!column.state && column.icons.inactive.trim() === '' && column.defaultIcons.inactive.trim() !== ''" :icon="column.defaultIcons.inactive.split(' ')" size="6x"></fa-icon>
            <fa-icon class="default-icon" v-if="column.state && column.icons.active.trim() === '' && column.defaultIcons.active.trim() !== ''" :icon="column.defaultIcons.active.split(' ')" size="6x"></fa-icon>

            <p class="label">{{ column.label }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigModal from '@/components/ConfigModal.vue'

export default {
  name: 'board',
  props: {
    board: Object
  },
  methods: {
    buttonDragStart (event, row, column) {
      event.dataTransfer.setData('application/json', JSON.stringify({
        type: 'BUTTON',
        data: {
          row,
          column
        }
      }))
    },
    buttonDragOver (event) {
      event.preventDefault()
    },
    buttonDragEnter (event) {
      event.preventDefault()
      event.target.classList.add('hover')
    },
    buttonDragLeave (event) {
      event.target.classList.remove('hover')
    },
    buttonDragDrop (event, row, column) {
      event.target.classList.remove('hover')
      const json = JSON.parse(event.dataTransfer.getData('application/json'))
      if (json.type === 'ACTION') {
        this.$store.dispatch('boards/SET_BUTTON_ACTION', {
          row,
          column,
          actionNamespace: json.data.namespace,
          action: json.data.id,
          defaultIcons: json.data.defaultIcons
        })
      } else if (json.type === 'BUTTON') {
        this.$store.dispatchPromise('boards/SWAP_BUTTONS', {
          source: {
            row: json.data.row,
            column: json.data.column
          },
          destination: {
            row,
            column
          }
        }).then(() => {
          this.$forceUpdate()
        })
      }
    },
    configureButton (row, column) {
      const button = this.$store.state.boards.saved[this.$store.state.boards.active].structure[row][column]
      
      this.$electron.ipcRenderer.send('actions', {
        event: 'GET_CONFIG_SCHEMA',
        data: {
          namespace: button.actionNamespace,
          action: button.action
        }
      })

      this.$electron.ipcRenderer.once('config', (event, data) => {
        if (data.namespace === button.actionNamespace && data.action === button.action) {
          this.$modal.show(ConfigModal, {
            inactiveIcon: button.icons.inactive,
            activeIcon: button.icons.active,
            config: button.config,
            schema: data.schema,
            row,
            column
          }, {
            scrollable: true,
            styles: 'background-color: #121212;',
            height: 'auto'
          })
        } 
      })
    },
    executeButton (row, column) {
      this.$electron.ipcRenderer.send('button', {
        event: 'EXECUTE',
        data: {
          row,
          column
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .container {
    display: flex;
    justify-content: center;
    align-items: center;

    .grid {
      //margin: 0 auto;
      width: calc(100vw - 4rem);
      max-width: calc(100vh - 4rem);
      //height: 80vw;
      max-height: calc(100vh - 4rem);

      .row {
        display: flex;

        .column {
          margin: 5px;
          color: white;
          font-weight: bold;
          flex: 1 0 auto;
          position: relative;

          &:after {
            content: "";
            float: left;
            display: block;
            padding-top: 100%;
          }

          .button {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            outline: unset;
            padding: unset;
            background: unset;
            border: 1px solid #FAFAFA;
            border-radius: 16px;

            .icon {
              width: 100%;
              height: 100%;
              border-radius: 16px;
            }

            &.active {
              background-color: #FAFAFA;
              
              .default-icon {
                color: #000000;
              }
            }

            &:hover, &.hover {
              cursor: pointer;
              transform: scale(1.1);
            }

            .label {
              position: absolute;
              bottom: 0;
              text-align: center;
              width: 100%;
            }

            .default-icon {
              color: #FAFAFA;
            }
          }
        }

        .column {
          margin: 0.75rem;
          flex: 1 0 auto;
          position: relative;

          &:after {
            content: "";
            float: left;
            display: block;
            padding-top: 100%;
          }
        }
      }
    }
  }
</style>
