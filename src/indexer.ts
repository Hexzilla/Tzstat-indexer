import axios from 'axios'
import { Contract, Cursor, Task, Token } from './types'
import * as database from './database'

const limit = 500

const getBigmapUpdates = (key: number, page: number) => {
  const url = `https://api.tzstats.com/explorer/bigmap/${key}/updates?prim=1&unpack=1&offset=${page}&limit=${limit}`
  console.log(url)
  return axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      return null
    })
}

const tasks: Task[] = []

const addTask = (task: Task, delay: number = 0) => {
  if (delay > 0) {
    setTimeout(() => tasks.push(task), delay)
  } else {
    tasks.push(task)
  }
}

const handleTokens = (contract: Contract, items: any[]) => {
  const name = contract.name
  const tokens = items
    .filter((i) => i.action === 'update')
    .map((item) => {
      return {
        address: item.key[0],
        tokenId: item.key[1],
        value: item.value,
      } as Token
    })
  if (tokens.length > 0) {
    database.updateTokens(name, tokens)
  }
}

const updateBigmap = async (task: Task) => {
  const { contract, cursor } = task
  const data = await getBigmapUpdates(contract.bigmap, cursor.page)
  console.log('data', data.length)
  if (data && data.length > 0) {
    await handleTokens(contract, data)

    if (data.length === limit) {
      cursor.page += data.length
      await database.updateCursor(contract.name, cursor.page)
    }

    addTask(task, data.length === limit ? 1000 : 3000)
  } else {
    addTask(task, 8000)
  }
}

const handleTask = async () => {
  if (tasks.length > 0) {
    const task = tasks.pop()
    await updateBigmap(task!)
  }
  setTimeout(handleTask, 100)
}

export const updateLedger = async (contracts: Contract[]) => {
  for (let contract of contracts) {
    const name = contract.name
    let cursor = await database.getCursor(name)
    if (!cursor) {
      cursor = { name, page: 0 } as Cursor
    }

    tasks.push({ contract, cursor })
  }

  setTimeout(handleTask, 10)
}
