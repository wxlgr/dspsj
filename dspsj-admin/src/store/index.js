import { createStore } from 'vuex'
import mutations from './mutations'
const state = {
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || ''
}

export default createStore({
    state,
    mutations
})