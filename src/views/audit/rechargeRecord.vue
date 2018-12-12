<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.account"></el-input>
      <el-select clearable class="filter-item" v-model="query.coinId" :placeholder="$t('tip.coin')" @change="handleFilter">
        <el-option v-for="item in coinList" :key="item.id" :label="item.coin_code" :value="item.id">
        </el-option>
      </el-select>
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.recharge_addr')" v-model="query.toAddress"></el-input>
      <el-select clearable class="filter-item" v-model="query.status" :placeholder="$t('tip.recharge_result')" @change="handleFilter">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker v-model="query.startTime" class="filter-item" type="datetime" :placeholder="$t('tip.startTime')"></el-date-picker>
      <el-date-picker v-model="query.endTime" class="filter-item" type="datetime" :placeholder="$t('tip.endTime')"></el-date-picker>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <!--<el-table-column align="center" label="UID" width="80" prop="account_id"></el-table-column>-->
      <el-table-column align="center" :label="$t('table.email')" width="150" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.area_code')" width="100" prop="area_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.mobile_number')" width="120" prop="mobile_number"></el-table-column>
      <el-table-column align="center" :label="$t('table.recharge_result')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.recharge_from_address')" width="150" prop="from_address"></el-table-column>
      <el-table-column align="center" :label="$t('table.recharge_address')" width="150" prop="to_address"></el-table-column>
      <el-table-column align="center" :label="$t('table.coin')" width="80" prop="coin_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.quantity')" width="150" prop="quantity"></el-table-column>
      <el-table-column align="center" :label="$t('table.tx_hash')" width="150" prop="tx_hash"></el-table-column>
      <el-table-column align="center" :label="$t('table.block')" width="150" prop="block"></el-table-column>
      <el-table-column align="center" :label="$t('table.remark')" width="150" prop="info"></el-table-column>
      <el-table-column align="center" :label="$t('table.recharge_date')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('table.actions')" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleConfirmation(scope.row)" style="width: 95px;">{{$t('table.rechargeConfirmation')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="$t('table.rechargeConfirmation')" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="temp" label-position="left" label-width="130px" style='margin-left:50px;'>
        <el-form-item :label="$t('table.recharge_from_address')" prop="from_address">
          <el-input v-model="temp.from_address"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.tx_hash')" prop="tx_hash" class="item-right">
          <el-input v-model="temp.tx_hash"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.block')" prop="block">
          <el-input v-model="temp.block"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.quantity')" prop="quantity">
          <el-input v-model="temp.quantity"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.remark')" prop="info" class="item-right">
          <el-input type="textarea" v-model="temp.info" :rows="3" style="width: 500px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="confirm()">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getCoinList } from '@/api/customer'
  import { rechargeFetchAll, rechargeConfirmation } from '@/api/audit'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime, intl } from '@/utils'

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
      statusFilter(val) {
        const map = {
          1: intl('map.success'),
          2: intl('map.fail')
        }
        return map[val]
      }
    },
    data() {
      return {
        dialogFormVisible: false,
        statusList: [{
          id: 1,
          label: intl('map.success')
        }, {
          id: 2,
          label: intl('map.fail')
        }],
        list: null,
        listLoading: true,
        total: null,
        query: {
          currPage: 1,
          pageSize: 15
        },
        coinList: [],
        temp: {
        },
        rules: {
          from_address: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          tx_hash: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          block: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          quantity: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        }
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
        rechargeFetchAll(para).then(result => {
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
      handleConfirmation(row) {
        // this.resetTemp()
        this.temp = Object.assign({}, row)
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      confirm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            rechargeConfirmation(this.temp).then(result => {
              this.$message({
                type: 'success',
                message: this.$t('tip.success')
              })
              this.dialogFormVisible = false
              this.getList()
            })
          }
        })
      }
    }
  }
</script>
<style scoped>

</style>
