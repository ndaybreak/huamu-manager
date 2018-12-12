<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.accountNumber"></el-input>
      <el-select class="filter-item" v-model="query.status" :placeholder="$t('tip.orderStatus')" @change="handleFilter">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" v-model="query.targetCoinId" :placeholder="$t('tip.baseCoin')" @change="handleFilter">
        <el-option v-for="item in coinList" :key="item.id" :label="item.coin_code" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" v-model="query.marketCoinId" :placeholder="$t('tip.targetCoin')" @change="handleFilter">
        <el-option v-for="item in marketCoinList" :key="item.id" :label="item.coin_code" :value="item.id">
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
      <el-table-column align="center" :label="$t('table.orderType')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.orderType | orderTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.orderStatus')" width="110">
        <template slot-scope="scope">
          <span>{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.email')" width="250" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.mobile')" width="150" prop="mobileNumber"></el-table-column>
      <el-table-column align="center" :label="$t('table.pair')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.targetCoinCode}}/{{scope.row.marketCoinCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.dealDirection')" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.tradeType | typeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.orderPrice')" width="120" prop="price"></el-table-column>
      <el-table-column align="center" :label="$t('table.orderAmount')" width="100" prop="quantity"></el-table-column>
      <el-table-column align="center" :label="$t('table.orderTotal')" width="120" prop="totalAmount"></el-table-column>
      <el-table-column align="center" :label="$t('table.dealPrice')" width="120" prop="averagePrice"></el-table-column>
      <el-table-column align="center" :label="$t('table.dealAmount')" width="120" prop="dealQuantity"></el-table-column>
      <el-table-column align="center" :label="$t('table.dealTotal')" width="100" prop="dealAmount"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  // import { getMarketCoinList } from '@/api/customer'
  import { getCoinList } from '@/api/customer'
  import { coin2coinFetchAll } from '@/api/query'
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
          1: intl('map.buy'),
          2: intl('map.sell')
        }
        return map[val]
      },
      orderTypeFilter(val) {
        const map = {
          1: intl('table.limitOrder'),
          2: intl('table.marketOrder')
        }
        return map[val]
      },
      statusFilter(val) {
        const map = {
          0: intl('table.newAdd'),
          1: intl('map.withdrawn'),
          2: intl('map.partDeal'),
          3: intl('map.deal')
        }
        return map[val]
      }
    },
    data() {
      return {
        statusList: [{
          id: '',
          label: intl('map.all')
        }, {
          id: 0,
          label: intl('table.newAdd')
        }, {
          id: 1,
          label: intl('map.withdrawn')
        }, {
          id: 2,
          label: intl('map.partDeal')
        }, {
          id: 3,
          label: intl('map.deal')
        }],
        list: null,
        listLoading: true,
        total: null,
        query: {
          currPage: 1,
          pageSize: 15,
          isDeleted: false,
          status: ''
        },
        coinList: [],
        marketCoinList: []
      }
    },
    created() {
      getCoinList().then(result => {
        this.coinList = result.data
      })
      getCoinList({ isMainCoin: true }).then(result => {
        this.marketCoinList = result.data
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
        coin2coinFetchAll(para).then(result => {
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
      }
    }
  }
</script>
<style scoped>

</style>
