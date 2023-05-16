import UUID from '../../type/UUID';
import { User as BackendUser, WebSession } from "../../src/user/model/User"
export {}

declare global {
  namespace Express {
    interface Request {
      bUser: BackendUser
      tokenId: WebSession
    }
  }
}