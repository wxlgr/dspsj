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
    <el-table class="user-table" border stripe :data="feedbacks.feedbackList" max-height="420px" style="width: 100%">
      <el-table-column prop="video.title" label="视频标题" width="100" show-overflow-tooltip />
      <el-table-column prop="reason.value" label="反馈原因" width="100" show-overflow-tooltip />
      <el-table-column prop="from.nickname" label="反馈人" width="80" show-overflow-tooltip />
      <el-table-column prop="active" label="状态" width="82">
        <template #default="scope">
          <el-tag :type="scope.row.active ? 'success' : 'info'">{{ formatIsActive(scope.row.active) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="反馈日期" width="180" show-overflow-tooltip
        :formatter="(row) => dateFormatter(row.createdAt)" />

      <el-table-column prop="isPublic" label="公开" width="70">
        <template #default="scope">
          <el-tag :type="scope.row.video.isPublic ? 'success' : 'info'">{{ formatIsPublic(scope.row.video.isPublic) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="coverPath" label="视频封面" width="130">
        <template #default="scope">
          <el-image style="width: 100px;height: 60px;" :src="formatUrl(scope.row.video.coverPath)"></el-image>
        </template>
      </el-table-column>

      <el-table-column prop="reportPath" label="视频链接" show-overflow-tooltip
        :formatter="(row) => formatUrl(row.video.videoPath)" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
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
      v-model:current-page="page.pageIndex" v-model:page-size="page.pageSize" :total="feedbacks.totalCount"
      :page-sizes="[2, 5, 10]" @current-change="handleCurrentChange" @size-change="handlePageSizeChange" />
  </div>
</template>

<script  setup>
import api from '../api/index'
import { formatDate } from '@/utils/dateFormate.js'
import { reactive, onMounted, ref } from 'vue'
import config from '../config/index'
import { ElMessage } from 'element-plus';

const formatUrl = (path) => {
  return path ? config.baseUrl + path : ''
}
const formatIsPublic = (flag) => {
  return flag ? '公开' : '私密'
}
const formatIsActive = (flag) => {
  return flag ? '待处理' : '已处理'
}

const dateFormatter = (time) => {
  return formatDate(time)
}

const searchText = ref('')

const feedbacks = reactive({
  feedbackList: [],
  totalCount: 0,
})

const page = reactive({
  pageIndex: 1,
  pageSize: 5
})

// 根据当前页，每页条数请求数据
const getFeedbacksByPage = async (index) => {
  const { result: list } = await api.findFeedbacksByPage(index || page.pageIndex, page.pageSize)
  console.log(list)
  feedbacks.feedbackList = list

}
// 根据当前页，每页条数请求数据
const getFeedbacksTotalCount = async (index) => {
  const { result: total } = await api.getFeedbacksTotalCount()
  feedbacks.totalCount = total
}
onMounted(async () => {
  try {
    getFeedbacksTotalCount()
    getFeedbacksByPage()
  } catch (error) {
    console.log(error)
  }
})






// 删除视频
const handleDelete = async (index, row) => {
  try {
    // let uid = row._id
    // ElMessage.warning('暂不支持视频删除')
  } catch (error) {
    console.log(error)

  }
}
// 当前页面改变
const handleCurrentChange = (pageIndex) => {
  getFeedbacksByPage()
}
// 每页显示条数改变
const handlePageSizeChange = (pageSize) => {
  getFeedbacksByPage()
}
// 查询
const doSearch = async () => {
  searchText.value = searchText.value.trim()
  if (!searchText.value) {
    return ElMessage.warning("搜索条件不能为空")
  }
  const { result } = await api.searchFeedbacks(searchText.value)
  feedbacks.feedbackList = result
  console.log(result)

  ElMessage.success(`查询到${result.length}条结果`)

}
// 重置
const resetTable = () => {
  searchText.value = ''
  page.pageIndex = 1
  page.pageSize = 5
  getFeedbacksByPage(1)
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