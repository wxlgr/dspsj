import store from "./index";

export default {
    // 保存userInfo
    saveUserInfo(state, userInfo){
        state.userInfo = userInfo;
        localStorage.setItem("userInfo", JSON.stringify(userInfo))
    }
}