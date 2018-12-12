<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input type="number" style="width: 200px;" class="filter-item" :placeholder="$t('tip.areaCode')" v-model="query.areaCode"></el-input>
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.countryAbbr')" v-model="query.countryAbbr"></el-input>
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.countryNameChinese')" v-model="query.countryNameChinese"></el-input>
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.countryNameEnglish')" v-model="query.countryNameEnglish"></el-input>
      <el-select clearable class="filter-item" v-model="query.isTrade" :placeholder="$t('tip.isTrade')" style="width: 200px;" @change="getList">
        <el-option v-for="item in tradeList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">{{$t('table.query')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.areaCode')" width="150" prop="area_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.countryAbbr')" width="150" prop="country_abbr"></el-table-column>
      <el-table-column align="center" :label="$t('table.countryNameChinese')" width="150" prop="country_name_chinese"></el-table-column>
      <el-table-column align="center" :label="$t('table.countryNameEnglish')" width="180" prop="country_name_english"></el-table-column>
      <el-table-column align="center" :label="$t('table.isTrade')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.is_trade | bool2Ch}}</span>
        </template>
      </el-table-column>
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

      <el-table-column align="center" :label="$t('table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.is_deleted" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="!scope.row.is_deleted" size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.discontinue')}}</el-button>
          <el-button v-if="scope.row.is_deleted" size="mini" type="info" @click="handleRecover(scope.row)">{{$t('table.recover')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="tempInfo" label-position="left" label-width="170px" style='width: 900px; margin-left:50px;'>
        <el-form-item :label="$t('table.areaCode')" prop="area_code">
          <el-input type="number" v-model="tempInfo.area_code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.countryNameEnglish')" prop="country_name_english">
          <el-input v-model="tempInfo.country_name_english"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.countryNameChinese')" prop="country_name_chinese">
          <el-input v-model="tempInfo.country_name_chinese"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.countryAbbr')" prop="country_abbr">
          <el-input v-model="tempInfo.country_abbr"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.isTrade')" prop="is_trade">
          <el-radio v-model="tempInfo.is_trade" label='Y'>{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_trade" label='N'>{{$t('table.no')}}</el-radio>
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
  import { areaCodeFetchAll, areaCodeCreate, areaCodeUpdate, areaCodeDelete, areaCodeRecover } from '@/api/system'
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
          is_trade: 'Y'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('table.edit'),
          create: this.$t('table.add'),
          copy: this.$t('table.copy')
        },
        rules: {
          area_code: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          country_name_english: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          country_name_chinese: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          country_abbr: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          is_trade: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
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
      this.query.template = this.$route.query.templateId
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        areaCodeFetchAll(this.query).then(result => {
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
          areaCodeDelete(row.id).then(res => {
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
          is_trade: 'Y'
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
            areaCodeCreate(this.tempInfo).then(data => {
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
        this.tempInfo.is_trade = this.tempInfo.is_trade ? 'Y' : 'N'
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            areaCodeUpdate(this.tempInfo, this.updatingObj).then((res) => {
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
          areaCodeRecover(row.id).then(res => {
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
