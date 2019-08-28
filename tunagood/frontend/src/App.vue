<template>
  <div id="app">
    <p>私のアドレス: {{ myAddress }}</p>
    <p>balance: {{ myToken }} TNG</p>
    <p>{{ myIine }} thx received.</p>
    <button @click="sendTest()">send TNG</button>
    <button @click="like()">thx!</button>
    
  </div>
</template>

<script>
import { EasyClientForBrowser } from '@uniqys/easy-client'

export default {
  name: 'app',
  data(){
    return{
      client: new EasyClientForBrowser('http://localhost:8080'),
      myToken: 0,
      myIine: 0,
      myIineReceive: 0,
      myAddress: ''
    }
  },
  created() {
    this.fetchMyAddress()
    //this.fetchCreaterAddress()
    this.fetchMyToken()
    this.fetchMyIine()
    //this.fetchMyIine()
  },
  methods: {
    async fetchMyAddress() {
      this.myAddress = this.client.address.toString()
    },
    async fetchMyToken() {
      const response = await this.client.get('/api/token', { params: { address: this.myAddress } })
      const { balance } = response.data
      this.myToken = balance
      if(balance==0){
        this.tap()
      }
    },
    async fetchMyIine() {
      const response = await this.client.get('/api/iine', { params: { address: this.myAddress } })
      const { balance } = response.data
      this.myIine = balance
    },
    async tap() {
      await this.client.post('/api/tap', {}, { sign: true })
    },
    async like(){
      await this.client.post('/api/like', {}, { signe: true})
      this.fetchMyIine()
    },
    async sendTest() {
      await this.client.post('/api/sendTest', {}, { sign: true })
      this.fetchMyToken()
    },
    code(sushi) {
      const dna = new Buffer(sushi.dna)
      return {
        dish: dna.readUInt16BE(0) % 10,
        neta: dna.readUInt16BE(4) % 10,
        spice: dna.readUInt16BE(8) % 10,
      }
    }
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.sushi-wrapper {
  flex-wrap: wrap;
  display: flex;
}
</style>
