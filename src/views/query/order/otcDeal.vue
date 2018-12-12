<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.accountNumber"></el-input>
      <el-select class="filter-item" v-model="query.status" :placeholder="$t('tip.orderStatus')" @change="handleFilter">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-select class="filter-item" v-model="query.coinId" :placeholder="$t('table.coin')" @change="handleFilter" clearable>
        <el-option v-for="item in coinList" :key="item.id" :label="item.coin_code" :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker v-model="query.startTime" class="filter-item" type="datetime" :placeholder="$t('tip.startTime')"></el-date-picker>
      <el-date-picker v-model="query.endTime" class="filter-item" type="datetime" :placeholder="$t('tip.endTime')"></el-date-picker>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.orderNo')" width="150" prop="orderNo"></el-table-column>
      <el-table-column align="center" :label="$t('table.orderDate')" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.orderTime | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.orderStatus')" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.email')" width="200" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.mobile_number')" width="150" prop="mobileNumber"></el-table-column>
      <el-table-column align="center" :label="$t('table.merchant')" width="100" prop="merchantName"></el-table-column>
      <el-table-column align="center" :label="$t('table.payCode')" width="100" prop="payCode"></el-table-column>
      <el-table-column align="center" :label="$t('table.dealDirection')" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.type | typeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.coin')" width="60" prop="coinCode"></el-table-column>
      <el-table-column align="center" :label="$t('table.quantity')" width="80" prop="quantity"></el-table-column>
      <el-table-column align="center" :label="$t('table.otcCoin')" width="100" prop="legalTenderCode"></el-table-column>
      <el-table-column align="center" :label="$t('table.price')" width="70" prop="price"></el-table-column>
      <el-table-column align="center" :label="$t('table.totalAmount')" width="100" prop="totalAmount"></el-table-column>
      <el-table-column align="center" :label="$t('table.orderCancelDate')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.cancelTime | parseTime}}</span>
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
  import { getCoinList } from '@/api/customer'
  import { otcFetchAll } from '@/api/query'
  import waves from '@/directive/waves' // 水波纹指令
  import { intl } from '@/utils'

  export default {
    name: 'otcDeal',
    directives: {
      waves
    },
    filters: {
      typeFilter(val) {
        const map = {
          1: intl('map.sell'),
          2: intl('map.buy')
        }
        return map[val]
      },
      statusFilter(val) {
        const map = {
          0: intl('map.all'),
          1: intl('map.orderDone'),
          2: intl('map.orderCancel'),
          3: intl('map.notPay'),
          4: intl('map.coinNotRelease'),
          5: intl('map.appealing')
        }
        return map[val]
      }
    },
    data() {
      return {
        statusList: [{
          id: 0,
          label: intl('map.all')
        }, {
          id: 1,
          label: intl('map.orderDone')
        }, {
          id: 2,
          label: intl('map.orderCancel')
        }, {
          id: 3,
          label: intl('map.notPay')
        }, {
          id: 4,
          label: intl('map.coinNotRelease')
        }, {
          id: 5,
          label: intl('map.appealing')
        }],
        list: null,
        listLoading: true,
        total: null,
        query: {
          currPage: 1,
          pageSize: 15,
          isDeleted: false,
          status: 0
        },
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
          para.startTime = para.startTime.getTime() / 1000
        }
        if (para.endTime) {
          para.endTime = para.endTime.getTime() / 1000
        }
        otcFetchAll(para).then(result => {
          this.listLoading = false
          this.list = result.data
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
      },
      getTotalAmount(val, type) {
        if (type === 'BTC') {
          return val * 40000
        } else if (type === 'ETC') {
          return val * 2800
        } else {
          return val * 500
        }
      }
    }
  }
</script>
<style scoped>

</style>
