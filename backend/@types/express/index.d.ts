import { User as BackendUser } from "../../src/user/model/User"
export {}

declare global {
  namespace Express {
    interface Request {
      bUser: BackendUser
    }
  }
}