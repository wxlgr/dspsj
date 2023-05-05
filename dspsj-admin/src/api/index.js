/**
 * API 管理
 */

import request from "../utils/request";
const api = {
  // 登录

  login(data) {
    return request.post("/users/login", data);
  },
  //获取卡片统计信息列表

  getCardList() {
    return request.get("/getCardList");
  },

  //获取用户总数
  getUsersTotalCount() {
    return request.get("/users/totalCount");
  },
  //获取视频总数
  getVideosTotalCount() {
    return request.get("/videos/totalCount");
  },
  //获取bgm总数
  getBgmsTotalCount() {
    return request.get("/bgms/totalCount");
  },
  //获得视频内容举报总数
  getReportsTotalCount() {
    return request.get("/reports/reportsCount");
  },
  //获得视频播放反馈总数
  getFeedbacksTotalCount() {
    return request.get("/reports/feedbacksCount");
  },

  // 分页查询用户列表
  findUsersListByPage(pageIndex, pageSize) {
    return request.get("/users/findByPage", { pageIndex, pageSize });
  },
  // 分页查询视频列表
  findVideosListByPage(pageIndex, pageSize) {
    return request.get("/videos/findAllByPage", { pageIndex, pageSize });
  },
  // 分页查询bgm列表
  findBgmsListByPage(pageIndex, pageSize) {
    return request.get("/bgms/findByPage", { pageIndex, pageSize });
  },
  // 分页查询视频内容举报列表
  findReportsByPage(pageIndex, pageSize){
    return request.get("/reports/findReportsByPage", { pageIndex,pageSize})
  },
  // 分页查询视频内容举报列表
  findFeedbacksByPage(pageIndex, pageSize){
    return request.get("/reports/findFeedbacksByPage", { pageIndex,pageSize})
  },

  // 根据昵称
  searchUsers(searchText) {
    return request.get("/users/search", {
      searchText,
    });
  },
  // 根据标题和描述
  searchVideos(searchText) {
    return request.get("/videos/search", {
      searchText,
    });
  },
  // 根据标题
  searchBgms(searchText) {
    return request.get("/bgms/search", {
      searchText,
    });
  },
  // 举报模糊查询
  searchReports(searchText){
    return request.get("/reports/searchReports", {
      searchText,
    });
  },
  // 反馈模糊查询
  searchFeedbacks(searchText){
    return request.get("/reports/searchFeedbacks", {
      searchText,
    });
  },

  // 添加用户
  addUser(user) {
    return request.post("/users/register", user);
  },
  // 删除用户
  removeUser(uid) {
    return request.post("/users/remove", { uid });
  },
  // 添加bgm
  addBgm(bgm) {
    return request.post("/bgms/add", bgm);
  },
  // 添加bgm
  updateBgm(bgm) {
    return request.post("/bgms/update", bgm);
  },
  // 删除bgm
  removeBgm(id) {
    return request.post('/bgms/delete', { id });
  },
  // 删除视频
  removeVideo(uid) {
    return request.post("/videos/delete", { uid });
  },
  //禁止视频公开
  toggleVideoIsPublic(vid) {
    return request.post("/videos/toggleIsPublic", { vid });
  },

  // 删除文件
  deleteFile(filePath) {
    return request.post("/upload/delete", { filePath });
  },
};

export default api;
