<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="请输入UID" v-model="query.accountId"></el-input>-->
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.account"></el-input>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <!--<el-table-column align="center" label="UID" width="100" prop="account_id"></el-table-column>-->
      <el-table-column align="center" :label="$t('table.email')" width="170" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.area_code')" width="100" prop="area_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.mobile_number')" width="120" prop="mobile_number"></el-table-column>
      <el-table-column align="center" :label="$t('table.balance')" width="150" prop="balance">
        <template slot-scope="scope">
          <span>{{scope.row.balance}} {{scope.row.coin_code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleAction(scope.row, 'return')">{{$t('table.back')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="slim-dialog">
      <el-form :rules="rules" ref="dataForm" :model="tempInfo" label-position="left" label-width="100px" style='margin-left:50px;'>
        <el-form-item :label="$t('table.coin')">
          <span>{{tempCoinCode}}</span>
        </el-form-item>
        <el-form-item :label="$t('table.quantity')" prop="quantity">
          <el-input-number v-model="tempInfo.quantity" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.remark')" prop="info">
          <el-input type="textarea" :rows="5" :label="$t('tip.input')" v-model="tempInfo.info" style="width: 270px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { depositDoneFetchAll, depositPay, depositReturn, depositPenalty } from '@/api/customer'
  import waves from '@/directive/waves' // 水波纹指令
  import { intl } from '@/utils'

  export default {
    name: 'deposit',
    directives: {
      waves
    },
    filters: {
      statusFilter(isFrozen) {
        return isFrozen ? intl('frozen') : intl('normal')
      }
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
        dialogStatus: '',
        textMap: {
          pay: intl('pay'),
          return: intl('back'),
          penalty: intl('penalty')
        },
        rules: {
          quantity: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          info: [{ required: false, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        updatingObj: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        depositDoneFetchAll(this.query).then(result => {
          this.listLoading = false
          this.list = result.data
          this.total = result.pageInfo.totalCount
          if (this.list.length === 0 && this.query.currPage !== 1) {
            this.getList()
          }
        })
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
        this.tempInfo = {
          accountId: row.account_id,
          coinId: row.coin_id
        }
        this.tempCoinCode = row.coin_code
        this.dialogStatus = type
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleFilter() {
        this.query.currPage = 1
        this.getList()
      },
      confirm() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let action
            if (this.dialogStatus === 'pay') {
              action = depositPay
            } else if (this.dialogStatus === 'return') {
              action = depositReturn
            } else {
              action = depositPenalty
            }
            action(this.tempInfo).then((res) => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: this.$t('tip.successTitle'),
                message: this.$t('tip.success'),
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    }
  }
</script>
