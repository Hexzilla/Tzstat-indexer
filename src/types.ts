export type Contract = {
  name: string
  address: string
  bigmap: number
}

export type Cursor = {
  name: string
  page: number
}

export type Token = {
  address: string,
  tokenId: string,
  value: number,
}

export type Task = {
  contract: Contract
  cursor: Cursor
}

export type Melting = {
  email: string
  address: string
  amount: number
}

export type MeltingRanking = {
  address: string
  score: number
}