<template>
  <div class="container">
    <h3>Preferences</h3>
    <vue-tabs ref="tabs">
      <v-tab title="Plugins" class="plugins-tab">
        <div class="add-plugin-container">
          <input class="add-plugin-input" ref="addPluginInput" type="text" placeholder="Add plugin">
          <button class="add-plugin" @click="addPlugin">Add</button>
        </div>
        <div v-if="this.$store.state.application.plugins.length === 0">
          <p class="no-plugins">No plugins installed</p>
        </div>
        <div v-else v-for="(plugin, index) in this.$store.state.application.plugins" v-bind:key="index" class="plugin">
          <p class="plugin-name">{{ plugin.name }} <span class="plugin-version"> {{ plugin.version }}</span></p>
          <button class="remove" @click="removePlugin(plugin)">Remove</button>
        </div>
      </v-tab>
    </vue-tabs>
  </div>
</template>

<script>
import { VueTabs, VTab } from 'vue-nav-tabs'
import 'vue-nav-tabs/themes/vue-tabs.css'

export default {
  name: 'preferences-modal',
  components: {
    VueTabs,
    VTab
  },
  methods: {
    addPlugin () {
      this.$electron.ipcRenderer.send('application', {
        event: 'ADD_PLUGIN',
        data: {
          package: this.$refs.addPluginInput.value
        }
      })
    },
    removePlugin (plugin) {
      this.$electron.ipcRenderer.send('application', {
        event: 'REMOVE_PLUGIN',
        data: {
          name: plugin.name
        }
      })
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

    h3 {
      margin-top: unset;
    }
  }
</style>

<style lang="scss">
  .container {
    .vue-tabs {
      width: 100%;

      .tabs__link {
        color: #FAFAFA;

        &.active_tab {
          background-color: #424242;
          border-color: #323232;
          color: #FAFAFA;
        }
      }

      .nav-tabs {
        border-bottom-color: #323232;

        li {
          a {
            &:hover, &:focus {
              background-color: #323232;
              border-color: #323232;
              color: #FAFAFA;
            }
          }
        }
      }

      .tab-content {
        .plugins-tab {
          .plugin {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0.75rem;

            p {
              margin: unset;
            }

            .plugin-name {
              align-self: center;

              .plugin-version {
                color: darken(#FAFAFA, 50%);
              }
            }

            button {
              padding: 0.75rem;
              border: unset;
              background-color: #F44336;
              color: #FAFAFA;

              &:hover {
                cursor: pointer;
                background-color: #D32F2F;
              }
            }
          }
          
          .no-plugins {
            padding: 0.75rem;
            margin: unset;
          }

          .add-plugin-container {
            display: flex;
            padding: 0.75rem;

            .add-plugin-input {
              flex: 1;
              padding: 0.25rem
            }

            button {
              padding: 0.75rem;
              border: unset;
              background-color: #03A9F4;
              color: #FAFAFA;

              &:hover {
                cursor: pointer;
                background-color: #0288D1;
              }
            }
          }
        }
      }
    }
  }
</style>