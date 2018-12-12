<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="请输入UID" v-model="query.accountId"></el-input>-->
      <el-select clearable style="width: 200px" class="filter-item" v-model="query.status" @change="handleFilter" :placeholder="$t('tip.changeStatus')">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable style="width: 150px" class="filter-item" v-model="query.coinId" @change="handleFilter" :placeholder="$t('table.coin')">
        <el-option v-for="item in coinList" :key="item.id" :label="item.coin_code" :value="item.id">
        </el-option>
      </el-select>
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="请输入数字币ID" v-model="query.coinId"></el-input>-->
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.changeInfo')" v-model="query.info"></el-input>
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="请输入操作人" v-model="query.modifierId"></el-input>-->
      <el-date-picker v-model="query.startTime" class="filter-item" type="datetime" :placeholder="$t('tip.startTime')"></el-date-picker>
      <el-date-picker v-model="query.endTime" class="filter-item" type="datetime" :placeholder="$t('tip.endTime')"></el-date-picker>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.date')" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.time | parseTime}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="UID" width="120" prop="account_id"></el-table-column>-->
      <el-table-column align="center" :label="$t('table.email')" width="180" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.mobile_number')" width="180" prop="mobile_number"></el-table-column>
      <el-table-column align="center" :label="$t('table.changeStatus')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.remark')" width="150" prop="info"></el-table-column>
      <el-table-column align="center" :label="$t('table.coin')" width="100" prop="coin_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.balance_change')" width="150" prop="balance_change"></el-table-column>
      <el-table-column align="center" :label="$t('table.balance')" width="150" prop="balance"></el-table-column>
      <el-table-column align="center" :label="$t('table.operator')" width="150" prop="modifier_name"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { depositFetchAll } from '@/api/query'
  import { getCoinList } from '@/api/customer'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime, intl } from '@/utils'

  export default {
    name: 'merchantDepositLog',
    directives: {
      waves
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: intl('table.pay'),
          2: intl('table.back'),
          3: intl('table.penalty')
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        list: null,
        listLoading: true,
        total: null,
        query: {
          currPage: 1,
          pageSize: 15
        },
        statusList: [{
          id: 1,
          label: intl('table.pay')
        }, {
          id: 2,
          label: intl('table.back')
        }, {
          id: 3,
          label: intl('table.penalty')
        }],
        coinList: []
      }
    },
    created() {
      getCoinList().then(result => {
        this.coinList = result.data
      })
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        const para = Object.assign({}, this.query)
        if (para.startTime) {
          para.startTime = parseTime(para.startTime)
        }
        if (para.endTime) {
          para.endTime = parseTime(para.endTime)
        }
        depositFetchAll(para).then(response => {
          this.list = response.data
          this.listLoading = false
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
      }
    }
  }
</script>
<style scoped>

</style>
