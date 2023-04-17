import {usersApi} from './users'
import {videosApi} from './videos'
import {uploadApi} from './upload'
import {bgmsApi} from './bgm'

// 使用扩展运算符，合并api
const api = {
  ...usersApi,
  ...videosApi,
  ...uploadApi,
  ...bgmsApi
}

export default api