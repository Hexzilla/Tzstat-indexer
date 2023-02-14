import { Router } from 'express'
import * as database from './database'
import { Token } from './types'

const router: Router = Router()

router.get('/api/index/tokens/:name/:address/:token', async (req, res) => {
  const { name, address, token } = req.params
  console.log('FindToken', name, address, token)

  const result = await database.findToken(name, address, token)
  return res.json({
    tokenId: result.tokenId,
    value: result.value,
  })
})

router.get('/api/index/tokens/:name/:address', async (req, res) => {
  const { name, address } = req.params
  console.log('FindTokenList', name, address)

  const tokens = await database.findTokens(name, address)
  const result = tokens.map((i: Token) => ({
    tokenId: i.tokenId,
    value: i.value,
  }))
  return res.json(result)
})

router.post('/api/index/tokens/entrycoin', async (req, res) => {
  const { address, amount } = req.body
  console.log('UpdateEntryCoin', address, amount)

  await database.updateEntryCoin(address, amount)
  return res.json({ success: true, address, amount })
})

export default router
