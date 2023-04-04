/**
 * API 管理
 */

import request from '../utils/request'
export function login(data) {
    return request.post('/users/login', data);
}