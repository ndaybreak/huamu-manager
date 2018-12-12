<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.sortNum')" width="150" prop="sort_num"></el-table-column>
      <el-table-column align="center" :label="$t('table.pair')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.targetCoinCode}}/{{scope.row.marketCoinCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.modifier')" width="150" prop="modifyr"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="160" prop="modify_time">
        <template slot-scope="scope">
          <span>{{scope.row.modify_time | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.is_deleted" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="!scope.row.is_deleted" size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.discontinue')}}</el-button>
          <el-button v-if="scope.row.is_deleted" size="mini" type="info" @click="handleRecover(scope.row)">{{$t('table.recover')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<div class="pagination-container">-->
    <!--<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">-->
    <!--</el-pagination>-->
    <!--</div>-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="slim-dialog">
      <el-form :rules="rules" ref="dataForm" :model="tempInfo" label-position="left" label-width="170px" style='width: 900px; margin-left:50px;'>
        <el-form-item :label="$t('table.sortNum')" prop="sort_num">
          <el-input-number v-model="tempInfo.sort_num" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.base')" prop="targetCoinId">
          <el-select clearable class="filter-item" v-model="tempInfo.targetCoinId" :placeholder="$t('tip.select')">
            <el-option v-for="item in coinList" :key="item.id" :label="item.coin_code" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.target')" prop="marketCoinId">
          <el-select clearable class="filter-item" v-model="tempInfo.marketCoinId" :placeholder="$t('tip.select')">
            <el-option v-for="item in marketCoinList" :key="item.id" :label="item.coin_code" :value="item.id">
            </el-option>
          </el-select>
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
  import { getCoinList } from '@/api/customer'
  import { recommendFetchAll, recommendCreate, recommendUpdate, recommendDelete, recommendRecover } from '@/api/ad'
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
          targetCoinId: [{ required: true, message: this.$t('tip.select'), trigger: 'blur' }],
          marketCoinId: [{ required: true, message: this.$t('tip.select'), trigger: 'blur' }],
          sort_num: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        updatingObj: '',
        tradeList: [{
          id: true,
          label: this.$t('table.yes')
        }, {
          id: false,
          label: this.$t('table.no')
        }],
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
        recommendFetchAll(this.query).then(result => {
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
          recommendDelete(row.id).then(res => {
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
          targetCoinId: '',
          marketCoinId: '',
          sort_num: ''
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
            recommendCreate(this.tempInfo).then(data => {
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
            recommendUpdate(this.tempInfo, this.updatingObj).then((res) => {
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
          recommendRecover(row.id).then(res => {
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
