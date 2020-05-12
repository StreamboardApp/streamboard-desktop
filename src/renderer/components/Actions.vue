<template>
  <div class="sidebar">
    <h3 class="header">Actions</h3>
    <section v-for="(actionGroup, groupIndex) in this.$store.state.application.actions" :key="groupIndex">
      <h4 class="section-header">{{ actionGroup[0] }}</h4>
      <ul>
        <li v-for="(action, actionIndex) in actionGroup[1]" :key="actionIndex" class="action" draggable="true" @dragstart="dragActionStart($event, actionGroup[0], action.id, action.defaultIcons)">{{ action.label }}</li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: 'actions',
  methods: {
    dragActionStart (event, namespace, id, defaultIcons) {
      event.dataTransfer.setData('application/json', JSON.stringify({
        type: 'ACTION',
        data: {
          namespace,
          id,
          defaultIcons
        }
      }))
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

    section {
      .section-header {
        border-bottom: 1px solid #212121;
        text-align: center;
        text-transform: uppercase;
        line-height: 2rem;
        margin: unset;
        height: 2rem;
      }
    }

    ul {
      list-style: none;
      padding: unset;
      margin: unset;

      .action {
        width: 100%;
        padding: 0.75rem;
        border: unset;
        background-color: #121212;
        color: #FAFAFA;
        text-align: center;

        &:hover {
          cursor: pointer;
          background-color: #323232;
        }
      }
    }
  }
</style>
