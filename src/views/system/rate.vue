<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <span style="margin-left: 50px;color: red;font-size: 14px;">{{$t('tip.rate')}}</span>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.zhAbbr')" width="150" prop="name"></el-table-column>
      <el-table-column align="center" :label="$t('table.currencyAbbr')" width="150" prop="code"></el-table-column>
      <el-table-column align="center" :label="$t('table.symbol')" width="80" prop="symbol"></el-table-column>
      <el-table-column align="center" :label="$t('table.usdCurrencyExchangeRate')" width="150" prop="usdCurrencyExchangeRate"></el-table-column>
      <el-table-column align="center" :label="$t('table.isOtcTrade')" width="160" prop="modify_time">
        <template slot-scope="scope">
          <span>{{scope.row.isTrade | bool2Ch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="160" prop="modify_time">
        <template slot-scope="scope">
          <span>{{scope.row.time | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status == 0" size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.discontinue')}}</el-button>
          <el-button v-if="scope.row.status == 1" size="mini" type="info" @click="handleRecover(scope.row)">{{$t('table.recover')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<div class="pagination-container">-->
      <!--<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">-->
      <!--</el-pagination>-->
    <!--</div>-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="tempInfo" label-position="left" label-width="170px" style='width: 900px; margin-left:50px;'>
        <el-form-item :label="$t('table.zhAbbr')" prop="name">
          <el-input v-model="tempInfo.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.currencyAbbr')" prop="code">
          <el-input v-model="tempInfo.code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.symbol')" prop="symbol">
          <el-input v-model="tempInfo.symbol"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.usdCurrencyExchangeRate')" prop="usdCurrencyExchangeRate">
          <el-input type="number" v-model="tempInfo.usdCurrencyExchangeRate"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.isOtcTrade')" prop="isTrade">
          <el-radio-group v-model="tempInfo.isTrade">
            <el-radio :label="true">{{$t('table.yes')}}</el-radio>
            <el-radio :label="false">{{$t('table.no')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else-if="dialogStatus=='update'" type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { rateFetchAll, rateCreate, rateUpdate, rateDelete, rateRecover } from '@/api/system'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'coinTemplate',
    components: {
    },
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
          pageSize: 15
        },
        tempInfo: {
          isTrade: true
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('table.edit'),
          create: this.$t('table.add'),
          copy: this.$t('table.copy')
        },
        rules: {
          code: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          name: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          symbol: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          isTrade: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          usdCurrencyExchangeRate: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        updatingObj: '',
        tradeList: [{
          id: true,
          label: this.$t('table.yes')
        }, {
          id: false,
          label: this.$t('table.no')
        }]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        rateFetchAll(this.query).then(result => {
          this.listLoading = false
          this.list = result.data
          // this.total = result.pageInfo.totalCount
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
      handleDelete(row) {
        this.$confirm(this.$t('tip.stop'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          rateDelete(row.id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      },
      resetTemp() {
        this.tempInfo = {
          name: '',
          code: '',
          symbol: '',
          usdCurrencyExchangeRate: '',
          isTrade: true
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            rateCreate(this.tempInfo).then(data => {
              this.query.currPage = 1
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: this.$t('tip.successTitle'),
                message: this.$t('tip.createSuccess'),
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.updatingObj = row
        this.tempInfo = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            rateUpdate(this.tempInfo, this.updatingObj).then((res) => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: this.$t('tip.successTitle'),
                message: this.$t('tip.updateSuccess'),
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleFilter() {
        this.query.currPage = 1
        this.getList()
      },
      handleRecover(row) {
        this.$confirm(this.$t('tip.recover'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          rateRecover(row.id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      }
    }
  }
</script>
<style scoped>
  .item-right {
    margin-left: 60px;
  }
</style>
