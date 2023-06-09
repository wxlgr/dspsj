<template>
  <div class="container">
    <h2>视频列表</h2>
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
    </form>
    <el-table class="user-table" border stripe :data="videos.videoList" max-height="420px" style="width: 100%">
      <el-table-column prop="title" label="标题" width="100" show-overflow-tooltip />
      <el-table-column prop="_id" label="id" width="100" show-overflow-tooltip />
      <el-table-column prop="author.nickname" label="作者" width="80" show-overflow-tooltip />
      <el-table-column prop="isPublic" label="公开" width="70" >
        <template #default="scope">
          <el-tag  :type="scope.row.isPublic?'success':'info'">{{ formatIsPublic(scope.row.isPublic) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.desc ? scope.row.desc : '暂无描述' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="createdAt" label="发布日期" width="150" show-overflow-tooltip
        :formatter="(row) => dateFormatter(row.createdAt)" />
      <el-table-column prop="updatedAt" label="最近修改日期" width="150" show-overflow-tooltip
        :formatter="(row) => dateFormatter(row.updatedAt)" />
      <el-table-column prop="coverPath" label="视频封面" width="130">
        <template #default="scope">
          <el-image style="width: 100px;height: 60px;" :src="coverUrl(scope.row.coverPath)"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="videoPath" label="视频链接" show-overflow-tooltip
        :formatter="(row) => videoUrlFormatter(row.videoPath)" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-popconfirm v-if="scope.row.isPublic" title="确定禁止公开?" @confirm="handleToggleISPublic(scope.$index, scope.row)">
            <template #reference>
              <el-button size="small" type="warning">禁止公开</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm v-else title="确定恢复公开?" @confirm="handleToggleISPublic(scope.$index, scope.row)">
            <template #reference>
              <el-button size="small" type="warning">恢复公开</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="确定删除?" @confirm="handleDelete(scope.$index, scope.row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="pagination" layout="total, sizes, prev, pager, next, jumper"
      v-model:current-page="page.pageIndex" v-model:page-size="page.pageSize" :total="videos.totalCount"
      :page-sizes="[2, 5, 10]" @current-change="handleCurrentChange" @size-change="handlePageSizeChange" />
  </div>
</template>

<script  setup>
import api from '../api/index'
import { formatDate } from '@/utils/dateFormate.js'
import { reactive, onMounted, ref } from 'vue'
import config from '../config/index'
import { ElMessage } from 'element-plus';


const videoUrlFormatter = (videoPath) => {
  return config.baseUrl + videoPath
}
const dateFormatter = (time) => {
  return formatDate(time)
}
const formatIsPublic = (flag) => {
  return flag ? '公开' : '私密'
}

const searchText = ref('')

const videos = reactive({
  videoList: [],
  totalCount: 0,
})

const page = reactive({
  pageIndex: 1,
  pageSize: 5
})

// 根据当前页，每页条数请求数据
const getVideosByPage = async (index) => {
  const { result: list } = await api.findVideosListByPage(index || page.pageIndex, page.pageSize)
  console.log(list)
  videos.videoList = list

}
// 根据当前页，每页条数请求数据
const getVideosTotalCount = async (index) => {
  const { result: total } = await api.getVideosTotalCount()
  videos.totalCount = total
}
onMounted(async () => {
  try {
    getVideosTotalCount()
    getVideosByPage()
  } catch (error) {
    console.log(error)
  }
})

const coverUrl = (coverPath) => {
  return coverPath ? config.baseUrl + coverPath : ''
}


// 禁止公开/恢复公开
const handleToggleISPublic = async (index, row) => {
  try {
    let vid = row._id
    const { code, msg } = await api.toggleVideoIsPublic(vid)
    ElMessage[code == 0 ? 'success' : 'error'](msg)
    getVideosByPage()
  } catch (error) {
    console.log(error)
  }
}

// 删除视频
const handleDelete = async (index, row) => {
  try {
    let uid = row._id
    ElMessage.warning('暂不支持视频删除')
  } catch (error) {
    console.log(error)

  }
}
// 当前页面改变
const handleCurrentChange = (pageIndex) => {
  getVideosByPage()
}
// 每页显示条数改变
const handlePageSizeChange = (pageSize) => {
  getVideosByPage()
}
// 查询
const doSearch = async () => {
  searchText.value = searchText.value.trim()
  if (!searchText.value) {
    return ElMessage.warning("搜索条件不能为空")
  }
  const { result } = await api.searchVideos(searchText.value)
  videos.videoList = result
  console.log(result)
  
  ElMessage.success(`查询到${result.length}条结果`)

}
// 重置
const resetTable = () => {
  searchText.value = ''
  page.pageIndex = 1
  page.pageSize = 5
  getVideosByPage(1)
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

.add-cover {
  display: flex;
  justify-content: space-between;
}

.cover-uploader {
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