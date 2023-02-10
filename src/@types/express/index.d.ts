import { Server, Channel, Webapp } from 'models'

interface Payload {
  id: string
  username: string
  exp: number
  iat: number
}

declare global {
  namespace Express {
    interface Request {
      server: Server
      payload: Payload
      channel: Channel
      webapp: Webapp
    }
  }
}
