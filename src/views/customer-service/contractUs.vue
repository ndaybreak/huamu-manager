<template>
  <div class="app-container">
    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.mobile_number')" width="150" prop="phone_number"></el-table-column>
      <el-table-column align="center" :label="$t('table.email')" width="250" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.website')" width="200" prop="website"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifier')" width="150" prop="modifier_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="160" prop="modify_time">
        <template slot-scope="scope">
          <span>{{scope.row.modify_time | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="slim-dialog">
      <el-form :rules="rules" ref="dataForm" :model="tempInfo" label-position="left" label-width="100px">
        <el-form-item :label="$t('table.mobile_number')" prop="phone_number">
          <el-input v-model="tempInfo.phone_number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input v-model="tempInfo.email"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.website')" prop="website">
          <el-input v-model="tempInfo.website"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchSystemInfo, updateSystemInfo } from '@/api/customerService'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'contractUs',
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
          phone_number: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          email: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          website: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        updatingObj: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchSystemInfo().then(result => {
          this.listLoading = false
          this.list = result.data ? [result.data] : []
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
            updateSystemInfo(this.tempInfo, this.updatingObj).then((res) => {
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
