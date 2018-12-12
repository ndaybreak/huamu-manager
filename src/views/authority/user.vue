<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.name"></el-input>
      <!--<el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.full_name')" v-model="query.fullName"></el-input>-->
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">{{$t('table.query')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.account')" width="150" prop="name"></el-table-column>
      <el-table-column align="center" :label="$t('table.full_name')" width="150" prop="full_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.role')" width="150" prop="role_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.gender')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.gender | genderFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.status')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.is_enable | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.creator')" width="100" prop="creator_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.createTime')" width="160" prop="create_time">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.modifier')" width="100" prop="modifer_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="160" prop="modify_time">
        <template slot-scope="scope">
          <span>{{scope.row.modify_time | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="350" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>
          <el-button size="mini" type="info" @click="handleReset(scope.row)" style="width: 105px;">{{$t('table.resetPwd')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="tempInfo" label-position="left" label-width="150px" style='width: 900px; margin-left:50px;'>
        <el-form-item :label="$t('table.account')" prop="name">
          <el-input v-model="tempInfo.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.full_name')" prop="full_name">
          <el-input v-model="tempInfo.full_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.role')" prop="roleId">
          <el-select class="filter-item" v-model="tempInfo.roleId" :placeholder="$t('tip.select')">
            <el-option v-for="item in roleList" :key="item.key" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.gender')" prop="gender">
          <el-radio v-model="tempInfo.gender" :label='1'>{{$t('map.male')}}</el-radio>
          <el-radio v-model="tempInfo.gender" :label='2'>{{$t('map.female')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.isEnable')" prop="is_enable">
          <el-radio v-model="tempInfo.is_enable" :label="true">{{$t('table.yes')}}</el-radio>
          <el-radio v-model="tempInfo.is_enable" :label="false">{{$t('table.no')}}</el-radio>
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
  import { userFetchAll, userCreate, userUpdate, userDelete, getRoleDropDownList, resetPwd } from '@/api/authority'
  import waves from '@/directive/waves' // 水波纹指令
  import { intl } from '@/utils'

  export default {
    name: 'coinTemplate',
    components: {
    },
    directives: {
      waves
    },
    filters: {
      statusFilter(is_enable) {
        return is_enable ? intl('map.normal') : intl('map.stop')
      }
    },
    data() {
      return {
        roleList: [],
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        query: {
          currPage: 1,
          pageSize: 15,
          isDeleted: false
        },
        tempInfo: {
          gender: 1,
          is_enable: true
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('table.edit'),
          create: this.$t('table.add'),
          copy: this.$t('table.copy')
        },
        rules: {
          name: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          full_name: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          roleId: [{ required: true, message: this.$t('tip.select'), trigger: 'blur' }]
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
      getRoleDropDownList().then(res => {
        this.roleList = res.data
      })
    },
    methods: {
      getList() {
        this.listLoading = true
        userFetchAll(this.query).then(result => {
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
        this.$confirm(this.$t('tip.delete'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          userDelete(row.id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      },
      handleReset(row) {
        this.$confirm(this.$t('tip.resetPwd'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          resetPwd(row.id).then(res => {
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
          full_name: '',
          roleId: null,
          gender: 1,
          is_enable: true
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
            userCreate(this.tempInfo).then(data => {
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
            userUpdate(this.tempInfo, this.updatingObj).then((res) => {
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
