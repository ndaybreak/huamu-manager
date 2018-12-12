<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.customerParaDesc')" width="120" prop="description"></el-table-column>
      <el-table-column align="center" :label="$t('table.customerLevel')" width="120" prop="level"></el-table-column>
      <el-table-column align="center" :label="$t('table.is_real_name')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.is_real_name | bool2Ch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.coin_fee_template')" width="150" prop="coin_fee_template_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.pairTemplate')" width="150" prop="target_market_coin_fee_template_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.is_common_otc')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.is_common_otc | bool2Ch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.common_otc_day_limit')" width="120" prop="common_otc_day_limit"></el-table-column>
      <el-table-column align="center" :label="$t('table.common_otc_single_limit')" width="120" prop="common_otc_single_limit"></el-table-column>
      <el-table-column align="center" :label="$t('table.is_big_otc')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.is_big_otc | bool2Ch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.big_otc_day_limit')" width="120" prop="big_otc_day_limit"></el-table-column>
      <el-table-column align="center" :label="$t('table.big_otc_single_limit')" width="120" prop="big_otc_single_limit"></el-table-column>
      <el-table-column align="center" :label="$t('table.is_coin_trade')" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.is_coin_trade | bool2Ch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.coin_day_limit')" width="120" prop="coin_day_limit"></el-table-column>
      <el-table-column align="center" :label="$t('table.is_withdraw_cash')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.is_withdraw_cash | bool2Ch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.withdraw_cash_day_limit')" width="120" prop="withdraw_cash_day_limit"></el-table-column>
      <el-table-column align="center" :label="$t('table.is_recharge')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.is_recharge | bool2Ch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.recharge_day_limit')" width="120" prop="recharge_day_limit"></el-table-column>
      <el-table-column align="center" :label="$t('table.creator')" width="100" prop="creator_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.createTime')" width="160" prop="create_time">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.modifier')" width="100" prop="modifier_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="160" prop="modify_time">
        <template slot-scope="scope">
          <span>{{scope.row.modify_time | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" :label="$t('table.actions')" width="160" class-name="small-padding fixed-width">
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
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="tempInfo" label-position="left" label-width="200px" style='width: 900px; margin-left:50px;'>
        <el-form-item :label="$t('table.customerLevel')" prop="level">
          <!--<el-select clearable class="filter-item" v-model="tempInfo.level" :placeholder="$t('tip.select')" style="width: 138px;">-->
            <!--<el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
          <el-input type="number" v-model="tempInfo.level"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.is_real_name')" prop="is_real_name" style="width: 400px;margin-left: 74px;" class="item-right">
          <el-radio v-model="tempInfo.is_real_name" label='Y'>{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_real_name" label='N'>{{$t('table.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.coin_fee_template')" prop="coin_fee_template">
          <el-select clearable class="filter-item" v-model="tempInfo.coin_fee_template" :placeholder="$t('tip.select')" style="width: 138px;">
            <el-option v-for="item in coinFeeTemplateList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.pairTemplate')" prop="target_market_coin_fee_template" class="item-right" style="margin-left: 74px;">
          <el-select clearable class="filter-item" v-model="tempInfo.target_market_coin_fee_template" :placeholder="$t('tip.select')">
            <el-option v-for="item in targetMarketCoinFeeTemplateList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_common_otc')" prop="is_common_otc" style="width: 400px;">
          <el-radio v-model="tempInfo.is_common_otc" label='Y'>{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_common_otc" label='N'>{{$t('table.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.common_otc_day_limit')" prop="common_otc_day_limit" class="item-right">
          <el-input-number v-model="tempInfo.common_otc_day_limit" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.common_otc_single_limit')" prop="common_otc_single_limit" style="width: 600px;">
          <el-input-number v-model="tempInfo.common_otc_single_limit" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.is_big_otc')" prop="is_big_otc" style="width: 400px;">
          <el-radio v-model="tempInfo.is_big_otc" label='Y'>{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_big_otc" label='N'>{{$t('table.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.big_otc_day_limit')" prop="big_otc_day_limit" class="item-right">
          <el-input-number v-model="tempInfo.big_otc_day_limit" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.big_otc_single_limit')" prop="big_otc_single_limit" style="width: 600px;">
          <el-input-number v-model="tempInfo.big_otc_single_limit" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.is_coin_trade')" prop="is_coin_trade" style="width: 400px;">
          <el-radio v-model="tempInfo.is_coin_trade" label='Y'>{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_coin_trade" label='N'>{{$t('table.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.coin_day_limit')" prop="coin_day_limit" class="item-right">
          <el-input-number v-model="tempInfo.coin_day_limit" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.is_withdraw_cash')" prop="is_withdraw_cash" style="width: 400px;">
          <el-radio v-model="tempInfo.is_withdraw_cash" label='Y'>{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_withdraw_cash" label='N'>{{$t('table.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.withdraw_cash_day_limit')" prop="withdraw_cash_day_limit" class="item-right">
          <el-input-number v-model="tempInfo.withdraw_cash_day_limit" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.is_recharge')" prop="is_recharge" style="width: 400px;">
          <el-radio v-model="tempInfo.is_recharge" label='Y'>{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_recharge" label='N'>{{$t('table.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.recharge_day_limit')" prop="recharge_day_limit" class="item-right">
          <el-input-number v-model="tempInfo.recharge_day_limit" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.customerParaDesc')" prop="description">
          <el-input type="textarea" style="width: 625px;" :rows="3" v-model="tempInfo.description"></el-input>
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
  import { customerLevelFetchAll, customerLevelCreate, customerLevelDropdown, coinFeeTemplateDropdown, targetMarketCoinFeeTemplateDropdown,
    customerLevelUpdate, customerLevelRecover, customerLevelDelete } from '@/api/customer'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'pushDraw',
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
          is_real_name: 'Y',
          is_common_otc: 'Y',
          is_big_otc: 'Y',
          is_coin_trade: 'Y',
          is_withdraw_cash: 'Y',
          is_recharge: 'Y'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('table.edit'),
          create: this.$t('table.add')
        },
        rules: {
          level: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          coin_fee_template: [{ required: true, message: this.$t('tip.select'), trigger: 'blur' }],
          target_market_coin_fee_template: [{ required: true, message: this.$t('tip.select'), trigger: 'blur' }],
          common_otc_day_limit: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          common_otc_single_limit: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          big_otc_day_limit: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          big_otc_single_limit: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          withdraw_cash_day_limit: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          recharge_day_limit: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          coin_day_limit: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          is_real_name: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          is_common_otc: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          is_big_otc: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          is_coin_trade: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          is_recharge: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          is_withdraw_cash: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          recharge_precision: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          withdraw_precision: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          otc_precision: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          deposit_precision: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          btc_exchange_rate: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          description: [{ required: false, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        levelList: [],
        updatingObj: '',
        coinFeeTemplateList: [],
        targetMarketCoinFeeTemplateList: []
      }
    },
    created() {
      this.getStaticData()
      this.getList()
    },
    methods: {
      getStaticData() {
        customerLevelDropdown().then(result => {
          this.levelList = result.data
        })
        coinFeeTemplateDropdown().then(result => {
          this.coinFeeTemplateList = result.data
        })
        targetMarketCoinFeeTemplateDropdown().then(result => {
          this.targetMarketCoinFeeTemplateList = result.data
        })
      },
      getList() {
        this.listLoading = true
        customerLevelFetchAll(this.query).then(result => {
          this.listLoading = false
          this.list = result.data
          this.total = result.pageInfo.totalCount
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
          customerLevelDelete(row.id).then(res => {
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
          customerLevelRecover(row.id).then(res => {
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
          is_real_name: 'Y',
          is_common_otc: 'Y',
          is_big_otc: 'Y',
          is_coin_trade: 'Y',
          is_withdraw_cash: 'Y',
          is_recharge: 'Y',
          level: '',
          coin_fee_template: '',
          target_market_coin_fee_template: '',
          common_otc_day_limit: '',
          common_otc_single_limit: '',
          big_otc_day_limit: '',
          big_otc_single_limit: '',
          withdraw_cash_day_limit: '',
          recharge_day_limit: '',
          coin_day_limit: '',
          recharge_precision: '',
          withdraw_precision: '',
          otc_precision: '',
          deposit_precision: '',
          btc_exchange_rate: '',
          description: ''
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
            customerLevelCreate(this.tempInfo).then(data => {
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

        this.tempInfo.is_real_name = this.tempInfo.is_real_name ? 'Y' : 'N'
        this.tempInfo.is_common_otc = this.tempInfo.is_common_otc ? 'Y' : 'N'
        this.tempInfo.is_big_otc = this.tempInfo.is_big_otc ? 'Y' : 'N'
        this.tempInfo.is_coin_trade = this.tempInfo.is_coin_trade ? 'Y' : 'N'
        this.tempInfo.is_recharge = this.tempInfo.is_recharge ? 'Y' : 'N'
        this.tempInfo.is_withdraw_cash = this.tempInfo.is_withdraw_cash ? 'Y' : 'N'
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            customerLevelUpdate(this.tempInfo, this.updatingObj).then((res) => {
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
      handleAvatarSuccess(res) {
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('uploadSuccess')
          })
          this.imageUrl = res.data.fileUrl
        } else {
          this.$message.error(res.info)
        }
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg'
        const isLt5M = file.size / 1024 / 1024 < 5
        const isImg = file.type.indexOf('image') > -1

        if (!isImg) {
          this.$message.error(this.$t('tip.pic'))
          return false
        }
        if (!isLt5M) {
          this.$message.error(this.$t('tip.picSize5'))
          false
        }
        return true
      }
    }
  }
</script>
<style scoped>
  .item-right {
    margin-left: 10px;
  }
</style>
