
const env = import.meta.env.MODE

const envConfig = {
    dev: {
        baseApi: 'http://localhost:3000/api/v1',
    }
}
export default {
    env: 'dev',
    mock: true,
    baseApi: envConfig.dev.baseApi
}