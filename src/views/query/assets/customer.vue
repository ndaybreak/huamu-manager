<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="请输入UID" v-model="query.accountId"></el-input>-->
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.account"></el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="query.operationType" @change="handleFilter" :placeholder="$t('tip.operationType')">
        <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable style="width: 150px" class="filter-item" v-model="query.coinId" @change="handleFilter" :placeholder="$t('table.coin')">
        <el-option v-for="item in coinList" :key="item.id" :label="item.coin_code" :value="item.id">
        </el-option>
      </el-select>
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.changeReason')" v-model="query.info"></el-input>
      <el-date-picker v-model="query.startTime" class="filter-item" type="datetime" :placeholder="$t('tip.startTime')"></el-date-picker>
      <el-date-picker v-model="query.endTime" class="filter-item" type="datetime" :placeholder="$t('tip.endTime')"></el-date-picker>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.date')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.time | parseTime}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="UID" width="100" prop="account_id"></el-table-column>-->
      <el-table-column align="center" :label="$t('table.email')" width="180" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.area_code')" width="100" prop="area_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.mobile')" width="110" prop="mobile_number"></el-table-column>
      <el-table-column align="center" :label="$t('table.operationType')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.operation_type | typeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.operationTypeDetail')" width="150" prop="operation_type_detail">
        <template slot-scope="scope">
          <span>{{scope.row.operation_type_detail | detailFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.changeReason')" width="150" prop="info"></el-table-column>
      <el-table-column align="center" :label="$t('table.coin')" width="100" prop="coin_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.frozen_balance')" width="120" prop="frozen_balance"></el-table-column>
      <el-table-column align="center" :label="$t('table.frozen_balance_change')" width="150" prop="frozen_balance_change"></el-table-column>
      <el-table-column align="center" :label="$t('table.available_balance')" width="120" prop="available_balance"></el-table-column>
      <el-table-column align="center" :label="$t('table.available_balance_change')" width="120" prop="available_balance_change"></el-table-column>
      <el-table-column align="center" :label="$t('table.total_balance')" width="120" prop="total_balance"></el-table-column>
      <el-table-column align="center" :label="$t('table.total_balance_change')" width="120" prop="total_balance_change"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { customerAssetChangeLog } from '@/api/query'
  import { getCoinList } from '@/api/customer'
  import waves from '@/directive/waves' // 水波纹指令
  import { intl } from '@/utils'

  export default {
    name: 'merchantDepositLog',
    directives: {
      waves
    },
    filters: {
      typeFilter(status) {
        const typeMap = {
          1: intl('map.recharge'),
          2: intl('map.withdraw'),
          3: intl('map.coin2coinTrade'),
          4: intl('map.ad'),
          5: intl('map.otcTrade'),
          6: intl('map.deposit'),
          7: intl('map.systemOperation')
        }
        return typeMap[status]
      },
      detailFilter(status) {
        const typeMap = {
          '101': intl('map.success'),
          '201': intl('map.request'),
          '202': intl('map.reject'),
          '203': intl('map.success'),
          '204': intl('map.fail'),
          '301': intl('map.order'),
          '302': intl('map.cancelOrder'),
          '303': intl('map.expend'),
          '304': intl('map.income'),
          '305': intl('map.commissionIncome'),
          '401': intl('map.publish'),
          '501': intl('map.order'),
          '502': intl('map.cancelOrder'),
          '503': intl('map.expend'),
          '504': intl('map.income'),
          '601': intl('table.pay'),
          '602': intl('table.back'),
          '701': intl('map.adjustPlus'),
          '702': intl('map.adjustMinus')
        }
        return typeMap[status]
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
        typeList: [{
          id: 1,
          label: intl('map.recharge')
        }, {
          id: 2,
          label: intl('map.withdraw')
        }, {
          id: 3,
          label: intl('map.coin2coinTrade')
        }, {
          id: 4,
          label: intl('map.ad')
        }, {
          id: 5,
          label: intl('map.otcTrade')
        },
        //   {
        //   id: 6,
        //   label: '保证金'
        // },
        {
          id: 7,
          label: intl('map.systemOperation')
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
          para.startTime = para.startTime.getTime()
        }
        if (para.endTime) {
          para.endTime = para.endTime.getTime()
        }
        customerAssetChangeLog(para).then(result => {
          this.list = result.data
          this.listLoading = false
          this.total = result.pageInfo.totalCount
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
