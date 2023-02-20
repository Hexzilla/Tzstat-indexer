import { TezosToolkit } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer'

const Tezos = new TezosToolkit(process.env.RPC!)
Tezos.setProvider({
  signer: new InMemorySigner(process.env.PIXL_ADMIN_PRIVATE_KEY!),
})

export const airdropPixltez = async (addresses: string[], amount: number) => {
  try {
    const contract = await Tezos.contract.at(process.env.PIXL_CONTRACT_ADDRESS!)

    const tokenId = Number(process.env.PIXL_TOKEN_ID)
    const params = addresses.map((address) => {
      return {
        owner: address,
        amount: (amount * 100).toString(),
        token_id: tokenId,
      }
    })
    const op = await contract.methods.mint_tokens(params).send()
    await op.confirmation(1)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
