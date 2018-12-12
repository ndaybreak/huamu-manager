<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="请输入UID" v-model="query.accountId"></el-input>-->
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.account"></el-input>
      <el-select clearable style="width: 150px" class="filter-item" v-model="query.status" @change="handleFilter" :placeholder="$t('tip.audit_status')">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker v-model="query.createStartTime" class="filter-item" type="datetime" :placeholder="$t('tip.request_start_date')"></el-date-picker>
      <el-date-picker v-model="query.createEndTime" class="filter-item" type="datetime" :placeholder="$t('tip.request_end_date')"></el-date-picker>
      <!--<el-checkbox class="filter-item" style='margin-left:15px;' v-model="query.sortAsc">按申请时间正序排列</el-checkbox>-->
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="min-height:500px;">
      <el-table-column align="center" :label="$t('table.handleStatus')" width="100" prop="status">
        <template slot-scope="scope">
          <span>{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.email')" width="150" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.area_code')" width="100" prop="area_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.mobile_number')" width="120" prop="mobile_number"></el-table-column>
      <el-table-column align="center" :label="$t('table.withdraw_coin')" width="80" prop="coin_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.quantity')" width="80" prop="quantity"></el-table-column>
      <el-table-column align="center" :label="$t('table.fee')" width="80" prop="service_fee"></el-table-column>
      <el-table-column align="center" :label="$t('table.withdraw_addr')" width="150" prop="to_address"></el-table-column>
      <el-table-column align="center" :label="$t('table.request_date')" width="180" prop="create_time">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.auditor')" width="100" prop="verifier_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.from_address')" width="150" prop="from_address"></el-table-column>
      <el-table-column align="center" :label="$t('table.tx_hash')" width="150" prop="tx_hash"></el-table-column>
      <el-table-column align="center" :label="$t('table.block')" width="150" prop="block"></el-table-column>
      <el-table-column align="center" :label="$t('table.operator')" width="100" prop="operator_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.remark')" width="150" prop="info"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="160" prop="modify_time">
        <template slot-scope="scope">
          <span>{{scope.row.modify_time | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" :label="$t('table.audit')" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 1" type="success" size="mini" @click="handleAudit(scope.row, 'pass')">{{$t('table.pass')}}</el-button>
          <el-button v-if="scope.row.status === 1" size="mini" type="danger" @click="handleAudit(scope.row, 'reject')">{{$t('table.reject')}}</el-button>
          <el-button v-if="scope.row.status === 3" type="success" size="mini" @click="handleResult(scope.row, 'success')">{{$t('table.success')}}</el-button>
          <el-button v-if="scope.row.status === 3" size="mini" type="warning" @click="handleResult(scope.row, 'fail')">{{$t('table.fail')}}</el-button>
          <el-button v-if="scope.row.status === 4" type="primary" size="mini" @click="handleUpdate(scope.row, 'success')">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status === 5" size="mini" type="primary" @click="handleUpdate(scope.row, 'fail')">{{$t('table.edit')}}</el-button>
          <!--<span v-if="scope.row.status !== 1 && scope.row.status !== 3">{{scope.row.status | statusFilter}}</span>-->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="temp" label-position="left" label-width="140px" style='margin-left:50px;'>
        <el-form-item :label="$t('table.from_address')" prop="from_address">
          <el-input v-model="temp.from_address"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.tx_hash')" prop="tx_hash" class="item-right">
          <el-input v-model="temp.tx_hash"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.block')" prop="block">
          <el-input v-model="temp.block"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.remark')" prop="info" class="item-right">
          <el-input type="textarea" v-model="temp.info" :rows="3" style="width: 500px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="resultConfirm(dialogStatus)">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  // customerInfoCheck
  import { withdrawFetchAll, withdrawVerifyHandling, withdrawVerifyRefuse, withdrawSuccess, withdrawFail } from '@/api/audit'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime, kebabCaseData2Camel, intl } from '@/utils'
  import imageView from 'vue-imageview'

  export default {
    name: 'customerAudit',
    components: {
      'image-view': imageView
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: intl('map.to_audit'),
          2: intl('map.audit_fail'),
          3: intl('map.handling'),
          4: intl('map.success'),
          5: intl('map.fail')
        }
        return statusMap[status]
      }
    },
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        query: {
          currPage: 1,
          pageSize: 15
        },
        statusList: [{
          id: 1,
          label: intl('map.to_audit')
        }, {
          id: 2,
          label: intl('map.audit_fail')
        }, {
          id: 3,
          label: intl('map.handling')
        }, {
          id: 4,
          label: intl('map.success')
        }, {
          id: 5,
          label: intl('map.fail')
        }],
        temp: {
          id: '',
          info: '',
          from_address: '',
          tx_hash: '',
          block: ''
        },
        dialogStatus: '',
        textMap: {
          success: intl('map.success'),
          fail: intl('map.fail')
        },
        dialogFormVisible: false,
        rules: '',
        successRules: {
          from_address: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          tx_hash: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          block: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        failRules: {
          info: [{ required: false, message: this.$t('tip.input'), trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleFilter() {
        this.query.currPage = 1
        this.getList()
      },
      resetTemp() {
        this.temp.from_address = ''
        this.temp.tx_hash = ''
        this.temp.block = ''
        this.temp.info = ''
      },
      resultConfirm(type) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (type === 'success') {
              withdrawSuccess(kebabCaseData2Camel(this.temp)).then(result => {
                this.$message({
                  type: 'success',
                  message: this.$t('tip.success')
                })
                this.dialogFormVisible = false
                this.getList()
              })
            } else {
              withdrawFail(kebabCaseData2Camel(this.temp)).then(result => {
                this.$message({
                  type: 'success',
                  message: this.$t('tip.success')
                })
                this.dialogFormVisible = false
                this.getList()
              })
            }
          }
        })
      },
      handleUpdate(row, type) {
        this.handleResult(row, type)
      },
      handleResult(row, type) {
        this.temp = {
          id: row.id,
          info: row.info,
          from_address: row.from_address,
          tx_hash: row.tx_hash,
          block: row.block
        }
        // this.resetTemp()
        this.dialogStatus = type
        this.rules = type === 'success' ? this.successRules : this.failRules
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleAudit(row, type) {
        const content = type === 'pass' ? intl('tip.audit_pass') : intl('tip.audit_fail')
        this.$prompt(content, this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          inputType: 'textarea',
          inputPlaceholder: intl('table.remark'),
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              if (type === 'reject' && !instance.inputValue) {
                this.$message.error(intl('tip.reject_reason'))
                return
              }
              done()
            } else {
              done()
            }
          }
        }).then(({ value }) => {
          const para = {
            id: row.id,
            info: value
          }
          if (type === 'pass') {
            withdrawVerifyHandling(para).then(res => {
              this.$message({
                type: 'success',
                message: this.$t('tip.success')
              })
              this.getList()
            })
          } else {
            withdrawVerifyRefuse(para).then(res => {
              this.$message({
                type: 'success',
                message: this.$t('tip.success')
              })
              this.getList()
            })
          }
        })
      },
      getList() {
        this.listLoading = true
        const para = Object.assign({}, this.query)
        if (para.createStartTime) {
          para.createStartTime = parseTime(para.createStartTime)
        }
        if (para.createEndTime) {
          para.createEndTime = parseTime(para.createEndTime)
        }
        withdrawFetchAll(para).then(result => {
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
      }
    }
  }
</script>
<style scoped>
  .dialog-item {
    padding: 10px 0;
  }
</style>
