<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input type="number" style="width: 200px;" class="filter-item" :placeholder="$t('tip.templateNo')" v-model="query.code"></el-input>
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.templateDesc')" v-model="query.description"></el-input>
      <el-select clearable style="width: 180px" class="filter-item" v-model="query.language" @change="handleFilter" :placeholder="$t('tip.templateLang')">
        <el-option v-for="item in languageList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">{{$t('table.query')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.templateNo')" width="110" prop="code"></el-table-column>
      <el-table-column align="center" :label="$t('table.templateLang')" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.language | languageFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.remark')" width="200" prop="description"></el-table-column>
      <el-table-column :label="$t('table.title')" width="200" prop="title"></el-table-column>
      <el-table-column :label="$t('table.content')" prop="content">
        <template slot-scope="scope">
          <p v-html="scope.row.content"></p>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.creator')" width="100" prop="name"></el-table-column>
      <el-table-column align="center" :label="$t('table.createTime')" width="160" prop="create_time">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.modifier')" width="100" prop="modifierName"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="160" prop="modify_time">
        <template slot-scope="scope">
          <span>{{scope.row.modify_time | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <!--<el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :inline="true" ref="dataForm" :model="tempInfo" label-position="left" label-width="170px" style='width: 900px; margin-left:50px;'>
        <el-form-item :label="$t('table.templateNo')" prop="code">
          <el-input-number v-model="tempInfo.code" :precision="1" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.templateLang')" prop="language">
          <el-select clearable class="filter-item" v-model="tempInfo.language" :placeholder="$t('tip.select')" style="width: 138px;">
            <el-option v-for="item in languageList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.remark')" prop="description">
          <el-input type="textarea" style="width: 585px;" :rows="2" v-model="tempInfo.description"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input style="width: 585px;" :rows="2" v-model="tempInfo.title"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.templateContent')" prop="content">
          <!--<el-input type="textarea" style="width: 643px;" :rows="3" v-model="tempInfo.content"></el-input>-->
          <Tinymce :height=300 ref="editor" v-model="tempInfo.content" :uploadUrl="uploadAction"/>
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
  import Tinymce from '@/components/Tinymce'
  import { emailTempateFetchAll, emailTempateCreate, emailTempateUpdate, emailTempateDelete } from '@/api/push'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'smTemplate',
    components: {
      Tinymce
    },
    directives: {
      waves
    },
    filters: {
    },
    data() {
      return {
        uploadAction: '',
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
          code: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          language: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          description: [{ required: false, message: this.$t('tip.input'), trigger: 'blur' }],
          title: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          content: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        updatingObj: '',
        coinFeeTemplateList: [],
        coinList: [],
        languageList: [{
          id: 0,
          label: '中文'
        }, {
          id: 1,
          label: 'English'
        }],
        initTinymce: true
      }
    },
    created() {
      this.uploadAction = this.baseUrl + '/file/public/uploadImg?type=10'
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        emailTempateFetchAll(this.query).then(result => {
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
          emailTempateDelete(row.id).then(res => {
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
          template: '',
          min_quantity: '',
          max_quantity: '',
          info: '',
          content: ''
        }
      },
      handleCreate() {
        const isEditorExist = typeof this.$refs['editor'] !== 'undefined'
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          isEditorExist && this.$refs['editor'].setContent('')
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            emailTempateCreate(this.tempInfo).then(data => {
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
        if (this.$refs['editor']) {
          this.initTinymce = false
        }
        this.updatingObj = row
        this.tempInfo = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        // destroyTinymce()
        this.$nextTick(() => {
          if (!this.initTinymce) {
            this.$refs['editor'].setContent(this.tempInfo.content)
          }
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            emailTempateUpdate(this.tempInfo, this.updatingObj).then((res) => {
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
