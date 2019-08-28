const keccak = require('keccak') // ファイルの一番上
const axios = require('axios') // ファイルの一番上
const express = require("express")
const bodyParser = require("body-parser")
const Memcached = require("memcached")

const APP_HOST = '0.0.0.0'  // backendサーバが動作するホスト名
const APP_PORT = 5650       // backendサーバが動作するポート番号
const DB_HOST = 'localhost' // inner memcachedのホスト名
const DB_PORT = 5652        // inner memcachedのポート番号
const INNER_API_HOST = 'localhost'
const INNER_API_PORT = 5651

const OPERATOR_ADDRESS = 'b8e6493bf64cae685095b162c4a4ee0645cde586'


const app = express() // expressを使う準備
const memcached = new Memcached(`${DB_HOST}:${DB_PORT}`) // memcached apiを使う準備

app.use(bodyParser())
app.use('/', express.static('frontend/dist'))

/* ここにサーバの内容を書いていく */
async function incrCount () {
    return new Promise((resolve, reject) => {
      memcached.incr('count', 1, (err, result) => {
        if (err) return reject(err)
        if (typeof result === 'number') return resolve(result)
        memcached.set('count', 1, 0, (err) => {
          if (err) return reject(err)
          resolve(1)
        })
        memcached.set('f0c006c77a5322b590bcea6388636320c2178173:port', 0, 0, (err) => {
          if (err) return reject(err)
          resolve(1)
        })
      })
    })
}

async function incrPoint (address) {
  new Promise((resolve, reject) => {
    memcached.incr(`f0c006c77a5322b590bcea6388636320c2178173:port`, 1, 0, (err, result) => {
      if (typeof result === 'number'){
        console.log(result)
        return resolve(result)
      } 
      memcached.set(`f0c006c77a5322b590bcea6388636320c2178173:port`, 1, 0, (err) => {
        console.log(address, result, 'aaaaabbbbb')
        resolve(1)
      }) 
    })
  })
}
 

async function transferToken(from, to, token) {
    return new Promise(async (resolve) => {
      const uri = `http://${INNER_API_HOST}:${INNER_API_PORT}/accounts/${from}/transfer`
      const newToken = await axios.post(uri, JSON.stringify({ to, value: parseInt(token) }), { headers: { 'Content-Type': 'application/json' } })
      resolve(newToken)
    })
}
  
app.get('/api/token', async (req, res) => {
    const { address } = req.query
    const uri = `http://${INNER_API_HOST}:${INNER_API_PORT}/accounts/${address}/balance`
    const response = await axios.get(uri)
    const balance = response.data[0]
    res.send({ balance })
  })

app.post('/api/tap', async (req, res) => {
    const sender = req.header('uniqys-sender')
    const uri = `http://${INNER_API_HOST}:${INNER_API_PORT}/accounts/${sender}/balance`
    const a = await axios.put(uri, JSON.stringify([10000]), { headers: { 'Content-Type': 'application/json' } })
    res.send()
})

app.post('/api/like', async (req, res) => {
  const sender = req.header('uniqys-sender')
  const a = incrPoint('f0c006c77a5322b590bcea6388636320c2178173')
  res.send()
})

app.get('/api/iine', async (req, res) => {
  const { address } = req.query
  const to = 'f0c006c77a5322b590bcea6388636320c2178173'
  memcached.get(`point:${address}`, (err, result) => {
    res.send(result)
  })
})

app.post('/api/sendTest', async (req, res) => {
  const sender = req.header('uniqys-sender')
  await transferToken(sender, 'f0c006c77a5322b590bcea6388636320c2178173', 500)
  res.send()
})

app.listen(APP_PORT, APP_HOST) // listenを開始する