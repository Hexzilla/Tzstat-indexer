import mongoose from 'mongoose'
import { Contract, Token } from 'types'

const IndexerSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true,
  },
  page: Number,
})

const TokenSchema = new mongoose.Schema<Token>({
  address: String,
  tokenId: String,
  value: Number,
})
TokenSchema.index({ address: 1, tokenId: 1 }, { unique: true })

const models = {} as any

const indexer = mongoose.model('indexer', IndexerSchema)
indexer.createCollection()

export const initialize = async (contacts: Contract[]) => {
  for (let contract of contacts) {
    const name = contract.name
    const model = mongoose.model(name, TokenSchema)
    await model.createCollection()
    console.log(`Collection ${name} is created!`)
    models[name] = model
  }
}

export const getCursor = async (name: string) => {
  return indexer.findOne({ name }).exec()
}

export const updateCursor = (name: String, page: Number) => {
  return indexer.updateOne({ name }, { name, page }, { upsert: true })
}

export const updateTokens = async (name: string, tokens: Token[]) => {
  const operations = tokens.map((token) => ({
    updateOne: {
      filter: { address: token.address, tokenId: token.tokenId },
      update: token,
      upsert: true,
    },
  }))
  return models[name].bulkWrite(operations)
}

export const findToken = async (name: string, address: string, tokenId: string) => {
  if (models[name]) {
    return models[name].findOne({ address, tokenId, value: { $gt: 0 } })
  }
  return {};
}

export const findTokens = async (name: string, address: string) => {
  if (models[name]) {
    return models[name].find({ address, value: { $gt: 0 } })
  }
  return [];
}