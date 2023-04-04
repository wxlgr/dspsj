const baseUrl = 'http://localhost:3000/api/v1'
const apiUrls = {
  login: baseUrl + '/users/login',
  register: baseUrl + '/users/register',

  findUser: baseUrl + '/users/find',
  updateUser: baseUrl + '/users/update',

  uploadAvatar:baseUrl+"/upload/avatar",
  uploadVideo:baseUrl+"/upload/video",
  uploadPhotos:baseUrl+"/upload/photos"
};

export default apiUrls