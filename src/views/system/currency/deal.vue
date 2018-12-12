<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="query.targetCoinId" @change="handleFilter" :placeholder="$t('tip.base')">
        <el-option v-for="item in coinList" :key="item.id" :label="item.coin_code" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="query.marketCoinId" @change="handleFilter" :placeholder="$t('tip.target')">
        <el-option v-for="item in marketCoinList" :key="item.id" :label="item.coin_code" :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <!--<el-table-column align="center" :label="$t('table.edit')序号" width="50" prop="id"></el-table-column>-->
      <el-table-column align="center" :label="$t('table.pair')" width="130">
        <template slot-scope="scope">
          <span>{{scope.row.target_coin_code}}/{{scope.row.market_coin_code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.base')" width="100" prop="target_coin_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.target')" width="100" prop="market_coin_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.target_precision')" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.target_precision}} {{scope.row.target_coin_code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.target_min_quantity')" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.target_min_quantity}} {{scope.row.target_coin_code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.market_precision')" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.market_precision}} {{scope.row.market_coin_code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.market_min_quantity')" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.market_min_quantity}} {{scope.row.market_coin_code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.creator')" width="100" prop="creator_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifier')" width="100" prop="modifier_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="180">
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

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="temp" label-position="left" label-width="150px" style='width: 900px; margin-left:50px;'>
        <el-form-item :label="$t('table.base')" prop="target_coin_id">
          <el-select clearable style="width: 150px" class="filter-item" v-model="temp.target_coin_id" :placeholder="$t('tip.select')">
            <el-option v-for="item in coinList" :key="item.id" :label="item.coin_code" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.target_precision')" prop="target_precision" class="item-right">
          <el-input-number v-model="temp.target_precision" :precision="8" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.target_min_quantity')" prop="target_min_quantity" style="margin-left: 376px">
          <el-input-number v-model="temp.target_min_quantity" :precision="8" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.target')" prop="market_coin_id">
          <el-select clearable style="width: 150px" class="filter-item" v-model="temp.market_coin_id" :placeholder="$t('tip.select')">
            <el-option v-for="item in marketCoinList" :key="item.id" :label="item.coin_code" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.market_precision')" prop="market_precision" class="item-right">
          <el-input-number v-model="temp.market_precision" :precision="8" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.market_min_quantity')" prop="market_min_quantity" style="margin-left: 376px">
          <el-input-number v-model="temp.market_min_quantity" :precision="8" :step="0.01"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getCoinList } from '@/api/customer'
  import { dealFetchAll, dealCreate, dealDelete, dealUpdate, dealRecover } from '@/api/system'
  import waves from '@/directive/waves' // 水波纹指令
  import imageView from 'vue-imageview'

  export default {
    name: 'deal',
    components: {
      'image-view': imageView
    },
    directives: {
      waves
    },
    data() {
      return {
        coinList: [],
        marketCoinList: [],
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        query: {
          currPage: 1,
          pageSize: 15
        },
        temp: {
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('table.edit'),
          create: this.$t('table.add')
        },
        rules: {
          target_coin_id: [{ required: true, message: this.$t('tip.select'), trigger: 'blur' }],
          market_coin_id: [{ required: true, message: this.$t('tip.select'), trigger: 'blur' }],
          target_precision: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          market_precision: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          market_min_quantity: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          target_min_quantity: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        updatingObj: ''
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
        dealFetchAll(this.query).then(result => {
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
      handleDelete(row) {
        this.$confirm(this.$t('tip.stop'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          dealDelete(row.id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      },
      handleRecover(row) {
        this.$confirm(this.$t('tip.recover'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          dealRecover(row.id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      },
      resetTemp() {
        this.temp = {}
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
            const para = Object.assign({}, this.temp)
            dealCreate(para).then((data) => {
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
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      getUpdatedObj(temp) {
        const newObj = { id: temp.id }
        Object.keys(temp).filter(attr => {
          return attr !== 'id'
        }).forEach(attr => {
          if (this.updatingObj[attr] !== temp[attr]) {
            newObj[attr] = temp[attr]
          }
        })
        return newObj
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const para = Object.assign({}, this.temp)
            dealUpdate(this.getUpdatedObj(para)).then((res) => {
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
      }
    }
  }
</script>
<style scoped>
  .item-right {
    margin-left: 60px;
  }
</style>
