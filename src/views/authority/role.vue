<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.role')" width="150" prop="name"></el-table-column>
      <el-table-column align="center" :label="$t('table.roleDesc')" width="400" prop="description"></el-table-column>
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
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="tempInfo" label-position="left"  style='width: 900px; margin-left:50px;'>
        <el-form-item :label="$t('table.role')" prop="name">
          <el-input v-model="tempInfo.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.roleDesc')" prop="description">
          <el-input v-model="tempInfo.description" style="width: 500px;"></el-input>
        </el-form-item>
      </el-form>
      <el-row class="menus-wrap">
        <el-col :span="10">
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            ref="tree"
            accordion
            highlight-current
            :props="defaultProps"
            @check-change="handleCheckChange">
          </el-tree>
          <div class="buttons">
            <!--<el-button @click="getCheckedNodes">get by node</el-button>-->
            <!--<el-button @click="getCheckedKeys">get by key</el-button>-->
            <!--<el-button @click="setCheckedNodes">set by node</el-button>-->
            <!--<el-button @click="setCheckedKeys">set by key</el-button>-->
          </div>
        </el-col>
        <el-col :span="4">
          <div class="tool-btn"><el-button @click="checkAll">全选</el-button></div>
          <div class="tool-btn"><el-button @click="resetChecked">取消</el-button></div>
        </el-col>
        <el-col :span="10">
          <el-tree :data="dataSelected"
                   default-expand-all
                   :props="defaultProps"></el-tree>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else-if="dialogStatus=='update'" type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
      <span class="line-left"></span>
      <span class="line-right"></span>
    </el-dialog>

  </div>
</template>

<script>
  import { roleFetchAll, roleCreate, roleUpdate, roleDelete } from '@/api/authority'
  import waves from '@/directive/waves' // 水波纹指令
  import { asyncRouterMap } from '@/router'
  import { deepClone, intl } from '@/utils'

  const formatMenus = (routerMap) => {
    routerMap.forEach(route => {
      route.id = route.meta.id
      route.label = intl('route.' + route.meta.title)
      if (route.children) {
        route.children = formatMenus(route.children)
      }
    })
    return routerMap.filter(route => {
      return !route.hidden
    })
  }

  const getSelectedData = (dataCopied, keys) => {
    const data = deepClone(dataCopied)
    return data.filter(route => {
      if (route.children && route.children.length) {
        route.children = getSelectedData(route.children, keys)
        if (route.children.length) {
          return true
        }
        return false
      } else if (keys.indexOf(route.id) >= 0) {
        return true
      } else {
        return false
      }
    })
  }

  export default {
    name: 'authrityRole',
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
          pageSize: 100
        },
        tempInfo: {
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('table.edit'),
          create: this.$t('table.add')
        },
        rules: {
          description: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          name: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        updatingObj: '',
        dataSelected: [],
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        roleFetchAll(this.query).then(result => {
          this.listLoading = false
          this.list = result.data
        })
      },
      handleDelete(row) {
        this.$confirm(this.$t('tip.delete'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          roleDelete(row.id).then(res => {
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
          description: ''
        }
      },
      validateMenu() {
        const keys = this.getCheckedKeys()
        const isValidate = !!keys.length
        if (!isValidate) {
          this.$message.error(this.$t('tip.menu'))
        }
        return isValidate
      },
      handleCreate() {
        this.data = formatMenus(deepClone(asyncRouterMap))
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.resetChecked()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid && this.validateMenu()) {
            this.tempInfo.code = this.getCheckedKeys().join(',')
            roleCreate(this.tempInfo).then(data => {
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
        this.data = formatMenus(deepClone(asyncRouterMap))
        this.updatingObj = row
        this.tempInfo = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.resetChecked()
          this.setCheckedKeys(this.tempInfo.code.split(','))
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid && this.validateMenu()) {
            this.tempInfo.code = this.getCheckedKeys().join(',')
            roleUpdate(this.tempInfo, this.updatingObj).then((res) => {
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
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate)
        // this.getCheckedKeys()
        this.dataSelected = getSelectedData(this.data, this.$refs.tree.getCheckedKeys())
      },
      handleNodeClick(data) {
        console.log(data)
      },
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes())
      },
      getCheckedKeys() {
        return this.$refs.tree.getCheckedKeys()
      },
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes([{
          id: 5,
          label: 'Level two 2-1'
        }, {
          id: 9,
          label: 'Level three 1-1-1'
        }])
      },
      setCheckedKeys(val) {
        this.$refs.tree.setCheckedKeys(val)
      },
      checkAll() {
        this.$refs.tree.setCheckedKeys(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([])
      }
    }
  }
</script>
<style scoped>
  .item-right {
    margin-left: 60px;
  }
  .menus-wrap {
    border: 1px solid #dcdfe6;
    width: 824px;
    margin-left: 50px;
    padding: 15px;
    height: 500px;
    overflow-y: auto;
  }
  .line-left {
    position: absolute;
    top: 112px;
    bottom: 97px;
    width: 1px;
    background: rgba(220, 223, 230, .6);
    left: 415px;
  }
  .line-right {
    position: absolute;
    top: 112px;
    bottom: 97px;
    width: 1px;
    background: rgba(220, 223, 230, .6);
    left: 538px;
  }
  .tool-btn {
    text-align: center;
    margin-bottom: 15px;
  }
</style>
