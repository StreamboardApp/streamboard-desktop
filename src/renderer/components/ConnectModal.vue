<template>
  <div class="container">
    <h3>Scan QR code</h3>
    <qrcode-vue class="qrcode" :value="getIP()" :size="200"></qrcode-vue>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import os from 'os'

export default {
  name: 'connect-modal',
  components: {
    QrcodeVue
  },
  methods: {
    getIP () {
      var interfaces = os.networkInterfaces()
      var addresses = []
      for (var interfaceIndex in interfaces) {
        for (var interfaceAddresses in interfaces[interfaceIndex]) {
          var address = interfaces[interfaceIndex][interfaceAddresses]
          if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address)
          }
        }
      }

      // TODO: Provide list of addresses to connect from / allow selecting another
      return JSON.stringify({
        service: 'streamboard',
        port: 6840,
        address: addresses[0]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 1rem;

    h3 {
      margin-top: unset;
    }

    .qrcode {
      padding: 1rem;
      background-color: #FFFFFF;
    }
  }
</style>