<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'streamboard-desktop'
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&display=swap');

  * {
    font-family: 'Oxygen', sans-serif;

    &:hover {
      outline: none;
    }
  }

  .window-title {
    color: #FAFAFA;
    text-transform: uppercase;
    font-weight: bold;
  }

  html, body {
    background-color: #212121;
    color: #FAFAFA;
  }

  #app {
    height: 100%;
  }
</style>
