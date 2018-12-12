<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="请输入UID" v-model="query.accountId"></el-input>-->
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.email"></el-input>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <!--<el-table-column align="center" label="UID" width="150" prop="id"></el-table-column>-->
      <el-table-column align="center" :label="$t('table.email')" width="250" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.area_code')" width="100" prop="area_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.mobile_number')" width="250" prop="mobile_number"></el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" style="width: auto;" @click="handleAction(scope.row, 'sm')">{{$t('table.checkSmRecord')}}</el-button>
          <el-button size="mini" type="warning" style="width: auto;" @click="handleAction(scope.row, 'email')">{{$t('table.checkEmailRecord')}}</el-button>
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
  import { recordFetchAll } from '@/api/push'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'deposit',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        query: {
          currPage: 1,
          pageSize: 15,
          accountId: ''
        },
        tempInfo: {
        },
        tempCoinCode: '',
        dialogFormVisible: false,
        detailDialogVisible: false,
        dialogStatus: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        recordFetchAll(this.query).then(result => {
          this.listLoading = false
          this.list = result.data
          this.total = result.pageInfo.totalCount
          if (this.list.length === 0 && this.query.currPage !== 1) {
            this.getList()
          }
        })
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
      },
      handleAction(row, type) {
        this.$router.push({
          path: 'record-detail',
          query: {
            type: type,
            userId: row.id,
            email: row.email
          }
        })
      }
    }
  }
</script>
