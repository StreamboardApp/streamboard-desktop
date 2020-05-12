<template>
  <div class="container">
    <h3 class="icons-header">Icons</h3>
    <div class="icons-container">
      <div class="icon-container">
        <input ref="inactiveFileInput" type="file" accept="image/*" @change="onIconChange('inactive')">
        <img @click="openIconFileInput('inactive')" class="icon inactive" :src="inactiveIcon">
        <p>Inactive</p>
      </div>
      <div class="icon-container">
        <input ref="activeFileInput" type="file" accept="image/*" @change="onIconChange('active')">
        <img @click="openIconFileInput('active')" class="icon active" :src="activeIcon">
        <p>Active</p>
      </div>
    </div>
    <h3 class="config-header">Configuration</h3>
    <div v-for="(inputSchema, index) in schema" :key="index" class="config">
      <label>{{ inputSchema.label }}</label>
      <select v-if="inputSchema.type === 'dropdown'" :value="config[inputSchema.id]" @change="configChanged($event, inputSchema.id)">
        <option v-for="(option, optionIndex) in inputSchema.values" :key="optionIndex" :value="option.value">{{ option.name }}</option>
      </select>
    </div>
    <button class="delete" @click="deleteButtonAction()">Delete Action</button>
  </div>
</template>

<script>
export default {
  name: 'config-modal',
  props: {
    inactiveIcon: String,
    activeIcon: String,
    config: Object,
    schema: Array,
    row: Number,
    column: Number
  },
  methods: {
    deleteButtonAction () {
      this.$store.dispatch('boards/SET_BUTTON_ACTION', {
        row: this.row,
        column: this.column,
        actionNamespace: '',
        action: '',
        defaultIcons: { inactive: '', active: '' }
      })

      this.$emit('close')
    },
    configChanged (event, id) {
      this.$store.dispatch('boards/SET_BUTTON_CONFIG', {
        row: this.row,
        column: this.column,
        id,
        value: event.target.value
      })
    },
    openIconFileInput (type) {
      if (type === 'inactive') {
        this.$refs.inactiveFileInput.click()
      } else if (type === 'active') {
        this.$refs.activeFileInput.click()
      }
    },
    onIconChange (type) {
      var fileElement
      if (type === 'inactive') {
        fileElement = this.$refs.inactiveFileInput
      } else if (type === 'active') {
        fileElement = this.$refs.activeFileInput
      }

      // This is intentional we only take the first file as we don't support selecting multiple files
      var file = fileElement.files[0]
      if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
        var reader = new FileReader()
        reader.onload = (event) => {
          if (type === 'inactive') {
            // This will throw a warning about modifying a prop in Vue. This is OK here
            this.inactiveIcon = event.target.result
          } else if (type === 'active') {
            // This will throw a warning about modifying a prop in Vue. This is OK here
            this.activeIcon = event.target.result
          }

          this.$store.dispatch('boards/SET_BUTTON_ICON', {
            row: this.row,
            column: this.column,
            type,
            src: event.target.result
          })
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 1rem;

    .icons-container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 50%;
      margin-bottom: 1rem;

      .icon-container {
        input {
          display: none;
        }

        .icon {
          width: 128px;
          height: 128px;
          border-radius: 1rem;

          &:hover {
            cursor: pointer;
          }
        }

        p {
          margin: unset;
          text-align: center;
          font-weight: bold;
        }
      }
    }

    .icons-header {
      margin-top: unset;
    }

    .config-header, .icons-header {
      text-transform: uppercase;
    }

    .config {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;

      label {
        margin-bottom: 0.25rem;
      }

      select {
        width: 50%;
        padding: 0.25rem;
        background-color: #323232;
        color: #FAFAFA;
        border: unset;
      }
    }

    .delete {
      margin-top: 1rem;
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
</style>