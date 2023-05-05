<template>
  <div class="container">
    <h2>bgm列表</h2>
    <!-- 搜索和新增 -->
    <form class="search-add">
      <el-input clearable class="input" v-model="searchText" placeholder="标题/描述模糊查询" @keyup.enter="doSearch">
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
    <el-table class="user-table" border stripe :data="bgms.bgmList" max-height="420px" style="width: 100%">
      <el-table-column prop="title" label="标题" width="150" show-overflow-tooltip />
      <el-table-column prop="_id" label="id" width="150" show-overflow-tooltip />
      <el-table-column prop="author.nickname" label="作者" width="80" show-overflow-tooltip />
      <el-table-column prop="bgmPath" label="bgm链接" show-overflow-tooltip :formatter="(row) => bgmUrl(row.bgmPath)" />
      <el-table-column prop="createdAt" label="发布日期" width="170" show-overflow-tooltip
        :formatter="(row) => dateFormatter(row.createdAt)" />
      <el-table-column prop="updatedAt" label="最近修改日期" width="170" show-overflow-tooltip
        :formatter="(row) => dateFormatter(row.updatedAt)" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" type="warning" @click="changeBgmTitle(scope.$index, scope.row)">修改名称</el-button>
          <el-popconfirm title="确定删除?" @confirm="handleDelete(scope.$index, scope.row)">
            <template #reference>
              <el-button size="small" type="danger">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="pagination" layout="total, sizes, prev, pager, next, jumper"
      v-model:current-page="page.pageIndex" v-model:page-size="page.pageSize" :total="bgms.totalCount"
      :page-sizes="[2, 5, 10]" @current-change="handleCurrentChange" @size-change="handlePageSizeChange" />


    <!-- 添加bgm对话框 -->
    <el-dialog v-model="isShowAddDialog" title=" 添加bgm" width="42%" center @closed="closeAddBGMDailog"
      @opend="whenOpenDailog">
      <el-form ref="addBgmFormRef" :inline="true" :model="addBgmForm" label-position="right" :rules="addBgmRules">
        <el-form-item label="名称" prop="title">
          <el-input v-model="addBgmForm.title" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input :value="loginStore.nickname" disabled />
        </el-form-item>
        <el-upload accept="audio/*" ref="bgmUploadRef" class="upload-demo" :action="bgmUploadAction" :limit="1"
          :auto-upload="false" :on-exceed="handleExceed" :on-success="uploadBgmSuccess" :on-change="onBgmChange"
          :on-remove="onBgmReove">
          <template #trigger>
            <el-button type="primary">select bgm</el-button>
          </template>
          <el-button style="margin-left: 10px;" type="success" @click="submitUpload">
            上传
          </el-button>
          <template #tip>
            <div class="el-upload__tip text-red">
              limit 1 bgm file
            </div>
          </template>
        </el-upload>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowAddDialog = false">取消</el-button>
          <el-button type="primary" @click="addBgm(addBgmFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script  setup>
import api from '../api/index'
import { ElMessage, genFileId } from 'element-plus'
import { formatDate } from '@/utils/dateFormate.js'
import { reactive, onMounted, ref } from 'vue'
import config from '../config/index'
import { useLoginStore } from '@/stores/loginStore.js'

// 是否新增成功一条bgm
const bgmAdded = ref(false)

const loginStore = useLoginStore()

const bgmUploadAction = ref(config.baseApi + '/upload/temp')
const addBgmForm = reactive({
  title: '',
  author: loginStore.nickname,
  bgmPath: ''
})
const addBgmFormRef = ref()
const addBgmRules = reactive({
  title: [{
    required: true,
    message: 'bgm名称不能为空',
    trigger: "change",
  }]
})

// 打开添加对话框时
function whenOpenDailog() {
  // 待新增
  bgmAdded.value = false
}
// 重置对话框
async function closeAddBGMDailog() {
  addBgmForm.author = loginStore.nickname
  addBgmForm.title = ''
  bgmUploadRef.value.clearFiles()

  //  没有新增成功关闭，而是取消关闭
  if (!bgmAdded.value) {
    // 如果有上传bgm，但是没有点确定
    if (addBgmForm.bgmPath) {
      const { msg, code } = await api.deleteFile(addBgmForm.bgmPath)
      ElMessage[code === 0 ? 'success' : 'error'](msg)
      addBgmForm.bgmPath = ''
    }
  }
}
// 
function onBgmChange(file) {
  console.log(file)
  addBgmForm.title = file.name
  if (!file.raw.type.startsWith('audio/')) {
    ElMessage.warning('请选择音频文件')
    //清除文件列表
    bgmUploadRef.value.clearFiles()
  }
}
async function onBgmReove(file) {
  addBgmForm.title = ''
  if (file.status === 'success') {
    addBgmForm.bgmPath = ''
    // 之前上传的路径
    const filePath = file.response.result.path
    const { msg, code } = await api.deleteFile(filePath)
    ElMessage[code === 0 ? 'success' : 'error'](msg)
  }

}

// 上传成功
function uploadBgmSuccess(res) {
  console.log(res);
  const { path } = res.result
  addBgmForm.bgmPath = path
}

// 新增bgm
function addBgm() {
  console.log(addBgmForm)
  if (!addBgmForm.bgmPath) {
    return ElMessage.warning('请先选择bgm并上传')
  }
  const bgm = {
    title: addBgmForm.title,
    uid: loginStore._id,
    bgmPath: addBgmForm.bgmPath
  }
  api.addBgm(bgm).then(res => {
    console.log(res)
    const { code, msg } = res
    ElMessage[code === 0 ? 'success' : 'error'](msg)
    if (code === 0) {
      isShowAddDialog.value = false
      // 新增成功
      bgmAdded.value = true
      // 重新获取总数和请求数据
      getBgmsTotalCount()
      getBgmsByPage()
    }
  })
}
const bgmUploadRef = ref()
// 覆盖文件
const handleExceed = (files) => {
  console.log(bgmUploadRef, files)
  bgmUploadRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  bgmUploadRef.value.handleStart(file)
}
const submitUpload = () => {
  bgmUploadRef.value.submit()
}

const dateFormatter = (time) => {
  return formatDate(time)
}

const isShowAddDialog = ref(false)
const searchText = ref('')

const bgms = reactive({
  bgmList: [],
  totalCount: 0,
})

const page = reactive({
  pageIndex: 1,
  pageSize: 5
})

// 根据当前页，每页条数请求数据
const getBgmsByPage = async (index) => {
  const { result: list } = await api.findBgmsListByPage(index || page.pageIndex, page.pageSize)
  console.log(list)
  bgms.bgmList = list

}
// 根据当前页，每页条数请求数据
const getBgmsTotalCount = async (index) => {
  const { result: total } = await api.getBgmsTotalCount()
  bgms.totalCount = total
}
onMounted(async () => {
  try {
    getBgmsTotalCount()
    getBgmsByPage()
  } catch (error) {
    console.log(error)
  }
})

const bgmUrl = (bgmPath) => {
  return bgmPath ? config.baseUrl + bgmPath : ''
}

const changeBgmTitle = async (index, row) => {
  console.log(row)
  const t = await ElMessageBox.prompt('请输入bgm的新名称', '修改bgm名称', {
    center: true,
    inputValue: row.title,
    inputValidator: (v) => {
      if (v.trim() === '') return "bgm的新名称不能为空"
      if (v.trim() === row.title) return "bgm的新旧名称不能一致"
    },
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).catch(_ => { })

  if (t.value) {
    const { code, msg } = await api.updateBgm({
      title: t.value.trim(),
      _id: row._id
    })
    ElMessage[code ===0 ? 'success' : 'error'](msg)
    getBgmsByPage()
  }



}
const handleDelete = async (index, row) => {
  try {
    let id = row._id
    let bgmPath = row.bgmPath
    // 删除文件
    const deleteFile = await api.deleteFile(bgmPath)
    ElMessage[deleteFile.code == 0 ? 'success' : 'error'](deleteFile.msg)
    // 删除记录
    const removeBgm = await api.removeBgm(id)
    ElMessage[removeBgm.code == 0 ? 'success' : 'error'](removeBgm.msg)
    getBgmsTotalCount()
    getBgmsByPage()
  } catch (error) {
    console.log(error)
  }
}

const handleCurrentChange = (pageIndex) => {
  getBgmsByPage()
}
const handlePageSizeChange = (pageSize) => {
  getBgmsByPage()
}
// 查询
const doSearch = async () => {
  searchText.value = searchText.value.trim()
  if (!searchText.value) {
    return ElMessage.warning("搜索条件不能为空")
  }
  const { result } = await api.searchBgms(searchText.value)
  console.log(result)

  bgms.bgmList = result
  ElMessage.success(`查询到${result.length}条结果`)

}
// 重置
const resetTable = () => {
  searchText.value = ''
  page.pageIndex = 1
  page.pageSize = 5
  getBgmsByPage(1)
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

.add-bgm {
  display: flex;
  justify-content: space-between;
}

.bgm-uploader {
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