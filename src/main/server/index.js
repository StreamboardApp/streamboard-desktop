import { Server as WebSocketServer } from 'ws'
import store from '../../renderer/store'

const HEARTBEAT = 15 * 1000

export default class StreamboardServer {
  constructor (actions) {
    this.actions = actions
  }

  setWindow(window) {
    this.window = window
  }

  start () {
    this.ws = new WebSocketServer({ port: 6840 })

    this.ws.on('connection', (ws) => {
      var lastHeartbeat = Date.now()

      ws.send(JSON.stringify({
        op: 1,
        data: {
          version: 1,
          heartbeat: HEARTBEAT,
          board: store.state.boards.saved[store.state.boards.active]
        }
      }))

      const heartbeatInterval = setInterval(() => {
        if (Date.now() - lastHeartbeat > HEARTBEAT) {
          ws.close(1000)
        }
      }, HEARTBEAT + (5 * 1000))

      var storeSubscription = store.subscribe((mutation, state) => {
        if (mutation.type.startsWith("boards")) {
          ws.send(JSON.stringify({
            op: 2,
            data: {
              board: state.boards.saved[state.boards.active]
            }
          }))
        }
      })

      ws.on('message', async (message) => {
        const json = JSON.parse(message)
        switch (json.op) {
        case 0: {
          const button = store.state.boards.saved[store.state.boards.active].structure[json.data.row][json.data.column]
          const action = button.action
          const actionNamespace = button.actionNamespace

          const buttonState = await this.actions.execute(actionNamespace, action, button.config)
          if (typeof buttonState === 'boolean') {
            this.window.webContents.send('button', {
              event: 'STATE',
              data: {
                row: json.data.row,
                column: json.data.column,
                state: buttonState
              }
            })
          }
          break
        }
        case 2: {
          lastHeartbeat = Date.now()
          break
        }
        }
      })

      ws.on('close', () => {
        storeSubscription()
        clearInterval(heartbeatInterval)
      })
    })
  }
}