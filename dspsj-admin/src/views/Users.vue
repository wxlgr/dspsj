<template>
  <div class="container">
    <h2>用户列表</h2>
    <!-- 搜索和新增 -->
    <form class="search-add">
      <el-input clearable class="input" v-model="searchText" placeholder="用户名/昵称模糊查询" @keyup.enter="doSearch">
        <template #prefix>
          <el-icon class="el-input__icon">
            <search />
          </el-icon>
        </template>
      </el-input>
      <el-button class="addBtn" @click="doSearch">查询</el-button>
      <el-button @click="resetTable">重置表格</el-button>

      <el-button @click="isShowAddDialog = true" class="addBtn" type="primary">新增</el-button>
    </form>

    <!-- 表格 -->
    <el-table class="user-table" border stripe :data="users.userList" max-height="420px" style="width: 100%">
      <el-table-column prop="username" label="用户名" width="100" how-overflow-tooltip />
      <el-table-column prop="_id" label="_id" width="200" show-overflow-tooltip />
      <el-table-column prop="nickname" label="昵称" width="100" />

      <el-table-column prop="gender.value" label="性别" width="120">
        <template #default="scope">
          <div class="value-tag">
            <span>{{ formatUnSetting(scope.row.gender.value) }}</span>
            <el-tag :type="scope.row.gender.isPublic ? 'success' : 'info'">{{ formatIsPublic(scope.row.gender.isPublic)
            }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="birthday.value" label="生日" width="160">
        <template #default="scope">
          <div class="value-tag">
            <span>{{ formatUnSetting(scope.row.birthday.value) }}</span>
            <el-tag :type="scope.row.birthday.isPublic === true ? 'success' : 'info'">{{
              formatIsPublic(scope.row.birthday.isPublic) }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="avatarPath" label="头像" show-overflow-tooltip>
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-avatar style="margin-right: 10px;width: 60px;height: 60px;" fit="cover"
              :src="avatarUrl(scope.row.avatarPath) || avatarDefault" />
            <div style="flex: 1;">{{ scope.row.avatarPath || avatarDefault }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bgPath" label="主页背景图" show-overflow-tooltip>
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-image style=" margin-right: 10px;width: 100px; height: 40px" :src="bgUrl(scope.row.bgPath) || bgDefault"
              fit="cover" />
            <div style="flex: 1;">{{ scope.row.bgPath || bgDefault }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-popconfirm title="确定删除该用户?" @confirm="handleDelete(scope.$index, scope.row)">
            <template #reference>
              <el-button size="small" type="danger">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="pagination" layout="total, sizes, prev, pager, next, jumper"
      v-model:current-page="page.pageIndex" v-model:page-size="page.pageSize" :total="users.totalCount"
      :page-sizes="[2, 5, 10]" @current-change="handleCurrentChange" @size-change="handlePageSizeChange" />
  </div>

  <!-- 添加用户 -->
  <el-dialog v-model="isShowAddDialog" title=" 添加用户" width="42%" center  @closed="closeAddDailog">
    <el-form ref="addUserFormRef" :inline="true" :model="addUserForm" label-position="right" :rules="addUserRules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addUserForm.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="addUserForm.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="addUserForm.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="password2">
        <el-input type="password" v-model="addUserForm.password2" placeholder="请再次输入密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShowAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addUser(addUserFormRef)">
          添加
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script  setup>
import api from '../api/index'
import md5 from 'md5'
import { reactive, onMounted, ref } from 'vue'
import config from '../config/index'
import avatarDefault from '@/assets/noneface.png'
import bgDefault from '@/assets/bg.png'
import { resetReactiveObjPropsAsEmptyStr } from '@/utils/resetReactiveObjPropsAsEmptyStr.js'

// 关闭添加对话框的回调
function closeAddDailog(){
  resetReactiveObjPropsAsEmptyStr(addUserForm)
}
// 原生表单句柄
const addUserFormRef = ref();
const addUserForm = reactive({
  username: '',
  nickname: '',
  password: '',
  password2: '',
})
const addUserRules = reactive({
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: [{
    required: true,
    message: "请输入密码",
    trigger: "blur",
  }],
  password2: [{
    trigger: "blur",
    validator: (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== addUserForm.password) {
        callback(new Error("两次密码不匹配"))
      } else {
        callback()
      }
    }
  },
  {
    required: true,
    message: "请输确认密码",
    trigger: "blur",
  }]
})




// 添加用户
function addUser(formEl) {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      console.log('submit!')
      const { username, nickname, password } = addUserForm
      const { code, msg } = await api.addUser({ username, nickname, password: md5(password) })
      ElMessage[code === 0 ? 'success' : 'info'](msg)
      // 重新获取数据
       getUsersByPage()
      // 关闭对话框
      isShowAddDialog.value = false
      resetReactiveObjPropsAsEmptyStr(addUserForm)
      getTotalCount()

    } else {
      console.log('error submit!')
      return false
    }
  })
}


const searchText = ref('')
const isShowAddDialog = ref(false)
const users = reactive({
  userList: [],
  totalCount: 0,
})

const page = reactive({
  pageIndex: 1,
  pageSize: 5
})

// 根据当前页，每页条数请求数据
const getUsersByPage = async (index) => {
  const { result: list } = await api.findUsersListByPage(index || page.pageIndex, page.pageSize)
  users.userList = list
}
// 根据当前页，每页条数请求数据
const getTotalCount = async (index) => {
  const { result: total } = await api.getUsersTotalCount()
  users.totalCount = total
}
onMounted(async () => {
  try {
    getTotalCount()
    getUsersByPage()
  } catch (error) {
    console.log(error)

  }
})

const avatarUrl = (avatarPath) => {
  return avatarPath ? config.baseUrl + avatarPath : ''
}
const bgUrl = (bgPath) => {
  return bgPath ? config.baseUrl + bgPath : ''
}

// 空值 未设置格式化
const formatUnSetting = (v) => {
  return v ? v : '未设置'
}
const formatIsPublic = (flag) => {
  return flag ? '公开' : '保密'
}


const handleDelete = async (index, row) => {
  try {
    let uid = row._id
    console.log(row)
    const { code, msg, result } = await api.removeUser(uid)
    ElMessage[code == 0 ? 'success' : 'error'](msg)
    getUsersByPage()
    getTotalCount()
  } catch (error) {
    console.log(error)

  }
}

const handleCurrentChange = (pageIndex) => {
  getUsersByPage()
}
const handlePageSizeChange = (pageSize) => {
  getUsersByPage()
}
// 查询
const doSearch = async () => {
  searchText.value = searchText.value.trim()
  if (!searchText.value) {
    return ElMessage.warning("搜索条件不能为空")
  }
  const { result } = await api.searchUsers(searchText.value)
  users.userList = result
  ElMessage.success(`查询到${result.length}条结果`)

}
// 重置
const resetTable = () => {
  searchText.value = ''
  page.pageIndex = 1
  page.pageSize = 5
  getUsersByPage(1)
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  padding: 10px;
  position: relative;
}

h2 {
  margin-bottom: 10px;
}

.search-add {
  width: 450px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  .input {
    width: 200px;
  }

  .addBtn {
    margin-left: 10px;
  }
}



.value-tag {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.add-avatar {
  display: flex;
  justify-content: space-between;
}

.avatar-uploader {
  margin: 10px;

  img {
    width: 100%;
  }
}

.pagination {
  position: absolute;
  z-index: 10;
  right: 0;
  bottom: 50px;
}
</style>