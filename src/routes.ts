import { Router } from 'express'
import * as database from './database'
import * as contract from './contract'
import { Token } from './types'

const router: Router = Router()

router.get('/api/index/tokens/:name/:address/:token', async (req, res) => {
  const { name, address, token } = req.params
  console.log('FindToken', name, address, token)

  const result = await database.findToken(name, address, token)
  return res.json({
    tokenId: token,
    value: result ? result.value : 0,
  })
})

router.get('/api/index/tokens/:name/:address', async (req, res) => {
  const { name, address } = req.params
  console.log('FindTokenList', name, address)

  const tokens = await database.findTokens(name, address)
  if (tokens) {
    const result = tokens.map((i: Token) => ({
      tokenId: i.tokenId,
      value: i.value,
    }))
    return res.json(result)
  } else {
    return res.json([])
  }
})

router.post('/api/index/tokens/entrycoin', async (req, res) => {
  const { address, amount } = req.body
  console.log('UpdateEntryCoin', address, amount)

  await database.updateEntryCoin(address, amount)
  return res.json({ success: true, address, amount })
})

router.post('/api/index/pixltez/airdrop/pixltez', async (req, res) => {
  const { addresses, amount } = req.body
  console.log('AirdropPixltez', addresses, amount)

  const success = await contract.airdropPixltez(addresses, amount)
  return res.json({ success })
})

router.post('/api/index/melting', async (req, res) => {
  const { email, address, amount } = req.body
  console.log('Melting', email, amount)

  await database.updateMeltingHome(email, address, amount)
  return res.json({ success: true })
})

router.get('/api/index/melting/ranking', async (req, res) => {
  const ranking = await database.getMeltingRanking()
  return res.json({ success: true, ranking })
})

router.post('/api/index/melting/score', async (req, res) => {
  const { address, score } = req.body
  console.log('MeltingScore', address, score)

  await database.updateMeltingRanking(address, score)
  return res.json({ success: true })
})

export default router
