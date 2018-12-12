<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.merchantDesc')" width="120" prop="description"></el-table-column>
      <el-table-column align="center" :label="$t('table.merchantLevel')" width="120" prop="level"></el-table-column>
      <el-table-column align="center" :label="$t('table.is_merchant')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.is_merchant | bool2Ch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.otcTemplate')" width="150" prop="otc_advert_limit_template_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.is_common_ad')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.is_common_ad | bool2Ch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.common_ad_day_limit')" width="150" prop="common_ad_day_limit"></el-table-column>
      <el-table-column align="center" :label="$t('table.is_big_ad')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.is_big_ad | bool2Ch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.big_ad_day_limit')" width="150" prop="big_ad_day_limit"></el-table-column>
      <el-table-column align="center" :label="$t('table.is_deposit')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.is_deposit | bool2Ch}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.deposit_coin_id')" width="120" prop="deposit_coin_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.deposit_limit')" width="120" prop="deposit_limit"></el-table-column>
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
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="tempInfo" label-position="left" label-width="170px" style='width: 900px; margin-left:50px;'>
        <el-form-item :label="$t('table.merchantLevel')" prop="level">
          <!--<el-select clearable class="filter-item" v-model="tempInfo.level" :placeholder="$t('tip.select')" style="width: 138px;">-->
            <!--<el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
          <el-input type="number" v-model="tempInfo.level"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.is_merchant')" prop="is_merchant" style="width: 300px;" class="item-right">
          <el-radio v-model="tempInfo.is_merchant" label='Y'>{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_merchant" label='N'>{{$t('table.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.otcTemplate')" prop="otc_advert_limit_template" style="width: 600px;">
          <el-select clearable class="filter-item" v-model="tempInfo.otc_advert_limit_template" :placeholder="$t('tip.select')" style="width: 138px;">
            <el-option v-for="item in otcAdList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_common_ad')" prop="is_common_ad" style="width: 300px;">
          <el-radio v-model="tempInfo.is_common_ad" label='Y'>{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_common_ad" label='N'>{{$t('table.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.common_ad_day_limit')" prop="common_ad_day_limit" class="item-right">
          <el-input-number v-model="tempInfo.common_ad_day_limit" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.is_big_ad')" prop="is_big_ad" style="width: 300px;">
          <el-radio v-model="tempInfo.is_big_ad" label='Y'>{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_big_ad" label='N'>{{$t('table.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.big_ad_day_limit')" prop="big_ad_day_limit" class="item-right">
          <el-input-number v-model="tempInfo.big_ad_day_limit" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.is_deposit')" prop="is_deposit" style="width: 300px;">
          <el-radio v-model="tempInfo.is_deposit" label='Y'>{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_deposit" label='N'>{{$t('table.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.deposit_coin_id')" prop="deposit_coin_id" class="item-right">
          <el-select clearable class="filter-item" v-model="tempInfo.deposit_coin_id" :placeholder="$t('tip.select')" style="width: 138px;">
            <el-option v-for="item in coinCategoryList" :key="item.id" :label="item.coin_code" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.deposit_limit')" prop="deposit_limit">
          <el-input-number v-model="tempInfo.deposit_limit" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.merchantDesc')" prop="description">
          <el-input type="textarea" style="width: 550px;" :rows="3" v-model="tempInfo.description"></el-input>
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
  import { merchantLevelFetchAll, merchantLevelCreate, merchantLevelDropdown, otcAdTemplateDropdown, coinCategoryDropdown,
    merchantLevelUpdate, merchantLevelRecover, merchantLevelDelete } from '@/api/customer'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'merchantLevel',
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
          is_merchant: 'Y',
          is_common_ad: 'Y',
          is_big_ad: 'Y',
          is_deposit: 'Y'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('table.edit'),
          create: this.$t('table.add')
        },
        rules: {
          level: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          is_merchant: [{ required: true, message: this.$t('tip.select'), trigger: 'blur' }],
          otc_advert_limit_template: [{ required: true, message: this.$t('tip.select'), trigger: 'blur' }],
          is_common_ad: [{ required: true, message: this.$t('tip.select'), trigger: 'blur' }],
          common_ad_day_limit: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          is_big_ad: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          big_ad_day_limit: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          is_deposit: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          deposit_coin_id: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          deposit_limit: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          description: [{ required: false, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        levelList: [],
        updatingObj: '',
        otcAdList: [],
        coinCategoryList: []
      }
    },
    created() {
      this.getStaticData()
      this.getList()
    },
    methods: {
      getStaticData() {
        merchantLevelDropdown().then(result => {
          this.levelList = result.data
        })
        otcAdTemplateDropdown().then(result => {
          this.otcAdList = result.data
        })
        coinCategoryDropdown().then(result => {
          this.coinCategoryList = result.data
        })
      },
      getList() {
        this.listLoading = true
        merchantLevelFetchAll(this.query).then(result => {
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
          merchantLevelDelete(row.id).then(res => {
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
          merchantLevelRecover(row.id).then(res => {
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
          is_merchant: 'Y',
          is_common_ad: 'Y',
          is_big_ad: 'Y',
          is_deposit: 'Y',
          level: '',
          otc_advert_limit_template: '',
          common_ad_day_limit: '',
          big_ad_day_limit: '',
          deposit_coin_id: '',
          deposit_limit: '',
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
            merchantLevelCreate(this.tempInfo).then(data => {
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

        this.tempInfo.is_merchant = this.tempInfo.is_merchant ? 'Y' : 'N'
        this.tempInfo.is_common_ad = this.tempInfo.is_common_ad ? 'Y' : 'N'
        this.tempInfo.is_big_ad = this.tempInfo.is_big_ad ? 'Y' : 'N'
        this.tempInfo.is_deposit = this.tempInfo.is_deposit ? 'Y' : 'N'
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            merchantLevelUpdate(this.tempInfo, this.updatingObj).then((res) => {
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
      }
    }
  }
</script>
<style scoped>
  .item-right {
    margin-left: 60px;
  }
</style>
