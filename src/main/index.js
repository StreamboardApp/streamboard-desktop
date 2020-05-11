'use strict'

import { app, BrowserWindow, Menu, ipcMain } from 'electron'
// This is required whether the store is used or not to work properly
import store from '../renderer/store'
import { PluginManager } from 'live-plugin-manager'
import path from 'path'
import ActionsService from './actions'
import StreamboardServer from './server'
import assert from 'assert'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const manager = new PluginManager({
  pluginsPath: path.join(process.cwd(), 'plugins')
})

const actions = new ActionsService(store)
const server = new StreamboardServer(actions)

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  server.setWindow(mainWindow)

  const menu = Menu.buildFromTemplate([
    {
      label: 'Application',
      submenu: [
        {
          label: 'Preferences',
          click () {
            mainWindow.webContents.send('application', {
              event: 'OPEN_PREFERENCES'
            })
          }
        },
        {
          label: 'Connect phone',
          click () {
            mainWindow.webContents.send('application', {
              event: 'CONNECT_PHONE'
            })
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click () {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Report Bug'
        },
        {
          label: 'About'
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('ready', () => {
  // Perform initialization if the first run
  if (store.state.application.firstRun) {
    store.dispatch('boards/SET_SAVED', [
      {
        name: 'Default Board',
        structure: [
          [
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            },
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            },
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            },
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            }
          ],
          [
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            },
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            },
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            },
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            }
          ],
          [
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            },
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            },
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            },
            {
              label: '',
              action: '',
              actionNamespace: '',
              config: {},
              icons: {
                inactive: '',
                active: ''
              }
            }
          ]
        ]
      }
    ])

    store.dispatch('application/SET_FIRST_RUN', false)

    // Temporary development setup
    store.dispatch('application/SET_PLUGINS', [
      {
        type: 'local',
        package: 'F:\\Streamboard\\streamboard-plugin-streamlabs'
      }
    ])
  }

  store.state.application.plugins.forEach(async pluginInfo => {
    loadPlugin(pluginInfo)
  })
  
  server.start()
})

async function loadPlugin(pluginInfo) {
  switch (pluginInfo.type) {
  case 'local': {
    console.log('Loading plugin', pluginInfo.package)
    try {
      const info = await manager.installFromPath(pluginInfo.package, {
        force: true
      })
      const plugin = manager.require(info.name)
      assert.equal(plugin !== null && typeof plugin === 'object' && !Array.isArray(plugin), true, `Plugin ${info.name} is not an object`)
      assert.equal(typeof plugin.namespace === 'string', true, `Plugin ${info.name} namespace is not a string`)
      assert.equal(typeof plugin.apiVersion === 'number' && !isNaN(plugin.apiVersion), true, `Plugin ${info.name} apiVersion is not a number`)
      assert.equal(Array.isArray(plugin.actions), true, `Plugin ${info.name} actions is not an array`)
      assert.equal(plugin.apiVersion <= 1 && plugin.apiVersion > 0, true, `Plugin ${info.name} does not have a supported API version. Plugin is using API version ${plugin.apiVersion} while we only support versions <= 1`)

      actions.registerActions(plugin.namespace, plugin.actions)
      console.log('Loaded plugin', pluginInfo.package)
    } catch (err) {
      console.log('Failed to load plugin', pluginInfo.package, err)
    }
    break
  }
  }
}

ipcMain.on('button', async (event, message) => {
  switch (message.event) {
  case 'EXECUTE': {
    const button = store.state.boards.saved[store.state.boards.active].structure[message.data.row][message.data.column]
    const action = button.action
    const actionNamespace = button.actionNamespace

    const buttonState = await actions.execute(actionNamespace, action, button.config)
    if (typeof buttonState === 'boolean') {
      event.sender.send('button', {
        event: 'STATE',
        data: {
          row: message.data.row,
          column: message.data.column,
          state: buttonState
        }
      })
    }
    break
  }
  }
})

ipcMain.on('actions', async (event, message) => {
  switch (message.event) {
  case 'GET_CONFIG_SCHEMA': {
    const action = message.data.action
    const actionNamespace = message.data.namespace

    const schema = await actions.getConfigSchema(actionNamespace, action)
    event.sender.send('config', {
      action: message.data.action,
      namespace: message.data.namespace,
      schema
    })
    break
  }
  }
})

ipcMain.on('application', async (event, message) => {
  switch (message.event) {
  case 'GET_PLUGINS': {
    var plugins = await manager.list()
    event.sender.send('plugins', {
      plugins
    })
    break
  }
  case 'ADD_PLUGIN': {
    await loadPlugin({
      type: 'local',
      package: message.data.package
    })
    var newPlugins = await manager.list()
    event.sender.send('plugins', {
      plugins: newPlugins
    })
    break
  }
  case 'REMOVE_PLUGIN': {
    const plugin = manager.require(message.data.name)
    actions.unregisterActions(plugin.namespace)
    await manager.uninstall(message.data.name)
    event.sender.send('plugins', {
      plugins
    })
    break
  }
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
