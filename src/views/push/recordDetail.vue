<template>
  <div class="app-container">
    <h4>{{title}}      <span style="margin-left: 50px;">{{$t('table.email')}}：{{email}}</span></h4>
    <div class="filter-container">
      <el-date-picker v-model="query.begintime" class="filter-item" type="datetime" :placeholder="$t('tip.startTime')"></el-date-picker>
      <el-date-picker v-model="query.endtime" class="filter-item" type="datetime" :placeholder="$t('tip.endTime')"></el-date-picker>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.date')" width="300">
        <template slot-scope="scope">
          <span>{{scope.row.time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.content')" prop="content">
        <template slot-scope="scope">
          <span v-html="scope.row.content"></span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { smRecordFetchAll, emailRecordFetchAll } from '@/api/push'
  import waves from '@/directive/waves' // 水波纹指令
  import { intl } from '@/utils'

  export default {
    name: 'merchantDepositLog',
    directives: {
      waves
    },
    filters: {
    },
    data() {
      return {
        list: null,
        listLoading: true,
        total: null,
        type: '',
        query: {
          currPage: 1,
          pageSize: 15,
          userId: ''
        },
        coinList: [],
        title: '',
        email: ''
      }
    },
    created() {
      this.query.userId = this.$route.query.userId
      this.type = this.$route.query.type
      this.email = this.$route.query.email
      if (this.type === 'sm') {
        this.title = intl('table.smRecord')
      } else {
        this.title = intl('table.emailRecord')
      }
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        const para = Object.assign({}, this.query)
        if (para.begintime) {
          para.begintime = para.begintime.getTime() / 1000
        }
        if (para.endtime) {
          para.endtime = para.endtime.getTime() / 1000
        }
        para.begintime = para.begintime || 0
        para.endtime = para.endtime || 1532574178154
        if (this.type === 'sm') {
          smRecordFetchAll(para).then(response => {
            this.list = response.data
            this.listLoading = false
            this.total = response.pageInfo.totalCount
          })
        } else {
          emailRecordFetchAll(para).then(response => {
            this.list = response.data
            this.listLoading = false
            this.total = response.pageInfo.totalCount
          })
        }
      },
      handleFilter() {
        this.query.currPage = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.query.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.query.currPage = val
        this.getList()
      }
    }
  }
</script>
<style scoped>

</style>
