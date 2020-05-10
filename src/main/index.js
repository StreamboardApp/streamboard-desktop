'use strict'

import { app, BrowserWindow, Menu, ipcMain } from 'electron'
// This is required whether the store is used or not to work properly
import store from '../renderer/store'
import { PluginManager } from 'live-plugin-manager'
import path from 'path'
import ActionsService from './actions'
import StreamboardServer from './server'

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
          label: 'Connect phone',
          click () {
            mainWindow.webContents.send('application', {
              event: 'CONNECT_PHONE'
            })
          }
        },
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

    store.dispatch('application/SET_PLUGINS', [
      {
        type: 'local',
        package: 'F:\\Streamboard\\streamboard-plugin-streamlabs'
      }
    ])
  }

  store.state.application.plugins.forEach(async pluginInfo => {
    switch (pluginInfo.type) {
    case 'local': {
      console.log('Loading plugin', pluginInfo.package)
      try {
        const info = await manager.installFromPath(pluginInfo.package, {
          force: true
        })
        const plugin = manager.require(info.name)
        // TODO: Sanity check the plugin
        actions.registerActions(plugin.namespace, plugin.actions)
      } catch (err) {
        console.log('Failed to load plugin', pluginInfo.package, err)
      }
      break
    }
    }
  })
  
  server.start()
})

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
