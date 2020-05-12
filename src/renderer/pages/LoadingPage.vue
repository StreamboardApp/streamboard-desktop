<template>
  <div class="page">
    <p class="state" v-if="this.state === 'LOADING_PLUGINS' || this.state === 'LOADING_PLUGIN'">Loading plugins</p>
    <p class="state" v-if="this.state === 'UPDATE_CHECK'">Checking for updates</p>
    <p class="state" v-if="this.state === 'READY'">Ready</p>
    <p class="information">{{ information }}</p>
  </div>
</template>

<script>
export default {
  name: 'loading-page',
  data () {
    return {
      state: '',
      information: ''
    }
  },
  mounted () {
    this.$electron.ipcRenderer.on('loading', (_, message) => {
      this.state = message.state
      if (this.state === 'LOADING_PLUGIN') {
        this.information = 'Loading plugin ' + message.data.name
      } else {
        this.information = ''
      }
    })

    this.$electron.ipcRenderer.on('ready', () => {
      this.state = 'READY'
      this.information = ''
      this.$router.replace('/')
    })

    // Tell the application everything is ready
    this.$electron.ipcRenderer.send('ready')
  }
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .state {
    text-transform: uppercase;
    font-weight: bold;
  }

  .information {
    color: darken($color: #FAFAFA, $amount: 50%);
    font-style: italic;
    margin: unset;
  }
}
</style>