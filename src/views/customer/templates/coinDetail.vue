<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select clearable style="width: 150px" class="filter-item" v-model="query.type" @change="handleFilter" :placeholder="$t('tip.rateType')">
        <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable style="width: 150px" class="filter-item" v-model="query.coinId" @change="handleFilter" :placeholder="$t('tip.coin')">
        <el-option v-for="item in coinList" :key="item.id" :label="item.coin_code" :value="item.id">
        </el-option>
      </el-select>
      <!--<el-select clearable style="width: 150px" disabled class="filter-item" v-model="query.template" @change="getList" :placeholder="$t('tip.coin')请选择费率模板">-->
        <!--<el-option v-for="item in coinFeeTemplateList" :key="item.id" :label="item.name" :value="item.id">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.remark')" v-model="query.info"></el-input>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">{{$t('table.query')}}</el-button>
      <el-button v-if="isEdit" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.rateTemplate')" width="200" prop="template_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.rateType')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.type | typeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.coin')" width="90" prop="coin_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.fee')" width="100" prop="fee_rate">
        <template slot-scope="scope">
          <span>{{scope.row.fee_rate}} {{scope.row.coin_code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.min_quantity')" width="120" prop="min_quantity"></el-table-column>
      <el-table-column align="center" :label="$t('table.max_quantity')" width="120" prop="max_quantity"></el-table-column>
      <el-table-column align="center" :label="$t('table.remark')" width="200" prop="info"></el-table-column>
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

      <el-table-column fixed="right" v-if="isEdit" align="center" :label="$t('table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="tempInfo" label-position="left" label-width="170px" style='width: 900px; margin-left:50px;'>
        <el-form-item :label="$t('table.rateType')" prop="type">
          <el-select clearable class="filter-item" v-model="tempInfo.type" :placeholder="$t('tip.select')">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.coin')" prop="coin_id" class="item-right">
          <el-select clearable class="filter-item" v-model="tempInfo.coin_id" :placeholder="$t('tip.select')">
            <el-option v-for="item in coinList" :key="item.id" :label="item.coin_code" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.fee')" prop="fee_rate">
          <el-input-number v-model="tempInfo.fee_rate" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.rateTemplate')" prop="template" class="item-right">
          <el-select clearable class="filter-item" v-model="tempInfo.template" :placeholder="$t('tip.select')">
            <el-option v-for="item in coinFeeTemplateList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.min_quantity')" prop="min_quantity">
          <el-input-number v-model="tempInfo.min_quantity" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.max_quantity')" prop="max_quantity" class="item-right">
          <el-input-number v-model="tempInfo.max_quantity" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.remark')" prop="info">
          <el-input type="textarea" style="width: 643px;" :rows="3" v-model="tempInfo.info"></el-input>
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
  import { coinTempateDetailFetchAll, coinTempateDetailCreate, coinTempateDetailUpdate, coinTempateDetailDelete, coinFeeTemplateDropdown, getCoinList } from '@/api/customer'
  import waves from '@/directive/waves' // 水波纹指令
  import i18n from '@/lang'
  console.log(i18n)

  export default {
    name: 'coinTemplate',
    components: {
    },
    directives: {
      waves
    },
    filters: {
      typeFilter(type) {
        const typeMap = {
          1: i18n.t('map.recharge'),
          2: i18n.t('map.withdraw')
        }
        return typeMap[type]
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
          pageSize: 15
        },
        tempInfo: {
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('table.edit'),
          create: this.$t('table.add'),
          copy: this.$t('table.copy')
        },
        rules: {
          type: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          coin_id: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          fee_rate: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          template: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          min_quantity: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          max_quantity: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          info: [{ required: false, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        typeList: [{
          id: 1,
          name: this.$t('map.recharge')
        }, {
          id: 2,
          name: this.$t('map.withdraw')
        }],
        updatingObj: '',
        coinFeeTemplateList: [],
        coinList: [],
        isEdit: false
      }
    },
    created() {
      this.query.template = parseInt(this.$route.query.templateId)
      this.isEdit = this.$route.query.isEdit
      this.getStaticData()
      this.getList()
    },
    methods: {
      getStaticData() {
        coinFeeTemplateDropdown().then(result => {
          this.coinFeeTemplateList = result.data
        })
        getCoinList().then(result => {
          this.coinList = result.data
        })
      },
      getList() {
        this.listLoading = true
        coinTempateDetailFetchAll(this.query).then(result => {
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
        this.$confirm(this.$t('tip.del'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          coinTempateDetailDelete(row.id).then(res => {
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
          type: '',
          coin_id: '',
          fee_rate: '',
          template: this.query.template,
          min_quantity: '',
          max_quantity: '',
          info: ''
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
            coinTempateDetailCreate(this.tempInfo).then(data => {
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
      handleFilter() {
        this.query.currPage = 1
        this.getList()
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
            coinTempateDetailUpdate(this.tempInfo, this.updatingObj).then((res) => {
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
