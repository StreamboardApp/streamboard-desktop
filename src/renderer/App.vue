<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
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

    .vm--overlay {
      background: rgba($color: #000000, $alpha: 0.5);
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition-duration: 0.25s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter-active {
    transition-delay: 0.25s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
</style>
