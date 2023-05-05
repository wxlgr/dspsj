
const env = import.meta.env.MODE
// console.log(env)


const envConfig = {
    dev: {
        baseApi: 'http://localhost:3000/api/v1',
        baseUrl: 'http://localhost:3000/'
    }
}
export default {
    env: 'dev',
    baseApi: envConfig.dev.baseApi,
    baseUrl:envConfig.dev.baseUrl
}