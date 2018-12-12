<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="请输入UID" v-model="query.accountId"></el-input>-->
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.email"></el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="query.disposeStatus" @change="handleFilter" :placeholder="$t('tip.handleStatus')">
        <el-option v-for="item in disposeStatusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="query.feedbackTime" @change="handleFilter" :placeholder="$t('tip.feedbackDateSort')">
        <el-option v-for="item in feedbackTimeSortList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="query.type" @change="handleFilter" :placeholder="$t('tip.questionType')">
        <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="min-height:500px;">
      <!--<el-table-column align="center" label="UID" width="120" prop="account_id"></el-table-column>-->
      <el-table-column align="center" :label="$t('table.email')" width="120" prop="account_email"></el-table-column>
      <el-table-column align="center" :label="$t('table.area_code')" width="120" prop="area_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.mobile_number')" width="120" prop="mobile_number"></el-table-column>
      <el-table-column align="center" :label="$t('table.handleStatus')" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.dispose_status | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.feedbackDate')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.feedback_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.questionType')" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.type | typeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.orderDetail')" width="150">
        <template slot-scope="scope">
          <el-button round @click="showDetail(scope.row)">{{$t('table.check')}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.remark')" width="150" prop="handler_explain"></el-table-column>
      <el-table-column align="center" :label="$t('table.operator')" width="150" prop="name"></el-table-column>
      <el-table-column align="center" :label="$t('table.operationTime')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.handler_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="190" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.dispose_status === 0" type="primary" size="mini" @click="hanleReplyEmail(scope.row)" style="width: 66px">{{$t('table.replyEmail')}}</el-button>
          <el-button v-if="scope.row.dispose_status === 0" size="mini" type="success" @click="hanleDone(scope.row)" style="width: 80px">{{$t('table.done')}}</el-button>
          <span v-if="scope.row.dispose_status === 2">{{$t('table.complete')}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="$t('table.check')" :visible.sync="dialogFormVisible">
      <el-row>{{$t('table.questionType')}}：{{tempInfo.type | typeFilter}}</el-row>
      <el-row class="feedback-info">
        <div>{{$t('table.questionDesc')}}：</div>
        <div>     {{tempInfo.feedbackInfo}}</div>
      </el-row>
      <el-row>{{$t('table.email')}}：{{tempInfo.email}}</el-row>
      <div>{{$t('table.screenshot')}}：</div>
      <PictureView v-if="dialogFormVisible" :pictureList="tempInfo.icons" width="50" height="50"></PictureView>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="dialogFormVisible=false">{{$t('table.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('table.replyEmail')" :visible.sync="postFormVisible">
      <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput name="name" v-model="postForm.title" required :maxlength="100">
            {{$t('table.title')}}
          </MDinput>
        </el-form-item>
        <div class="editor-container">
          <h3>{{$t('table.emailContent')}}：</h3>
          <Tinymce :height=300 ref="editor" v-model="postForm.content" :uploadUrl="uploadAction"/>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="postFormVisible=false">{{$t('table.close')}}</el-button>
        <el-button @click="replyEmail" type="primary">{{$t('table.send')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import MDinput from '@/components/MDinput'
  import { feedbackFetchAll, feedbackFetchDetail, feedbackReplyEmail, feedbackDone } from '@/api/customerService'
  import waves from '@/directive/waves' // 水波纹指令
  import { intl } from '@/utils'
  import PictureView from 'vue-simple-picture-preview'

  export default {
    name: 'feedback',
    components: {
      PictureView,
      Tinymce,
      MDinput
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: intl('map.notHandle'),
          2: intl('map.done')
        }
        return statusMap[status]
      },
      typeFilter(type) {
        const typeMap = {
          1: intl('map.questionType1'),
          2: intl('map.questionType2'),
          3: intl('map.questionType3'),
          4: intl('map.questionType4'),
          5: intl('map.questionType5'),
          6: intl('map.questionType6'),
          7: intl('map.questionType7'),
          8: intl('map.questionType8')
        }
        return typeMap[type] || '_'
      }
    },
    directives: {
      waves
    },
    data() {
      return {
        uploadAction: '',
        tempInfo: {
          icons: []
        },
        postForm: {},
        list: null,
        total: null,
        listLoading: true,
        query: {
          currPage: 1,
          pageSize: 15
        },
        rules: {
          title: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        dialogFormVisible: false,
        postFormVisible: false,
        disposeStatusList: [{
          id: 0,
          label: intl('map.notHandle')
        }, {
          id: 2,
          label: intl('map.done')
        }],
        typeList: [{
          id: 1,
          label: intl('map.questionType1')
        }, {
          id: 2,
          label: intl('map.questionType2')
        }, {
          id: 3,
          label: intl('map.questionType3')
        }, {
          id: 4,
          label: intl('map.questionType4')
        }, {
          id: 5,
          label: intl('map.questionType5')
        }, {
          id: 6,
          label: intl('map.questionType6')
        }, {
          id: 7,
          label: intl('map.questionType7')
        }, {
          id: 8,
          label: intl('map.questionType8')
        }],
        feedbackTimeSortList: [{
          id: false,
          label: intl('map.feedbackDateAsc')
        }, {
          id: true,
          label: intl('map.feedbackDateDesc')
        }]
      }
    },
    created() {
      this.uploadAction = this.baseUrl + '/file/public/uploadImg?type=6'
      this.getList()
    },
    methods: {
      hanleReplyEmail(row) {
        this.postForm = {
          id: row.id
        }
        this.postFormVisible = true
        this.$nextTick(() => {
          this.$refs['postForm'].clearValidate()
        })
      },
      replyEmail() {
        this.$refs['postForm'].validate((valid) => {
          if (valid) {
            if (!this.postForm.content) {
              this.$message.error(intl('tip.emailContent'))
              return
            }
            feedbackReplyEmail(this.postForm).then((data) => {
              this.postFormVisible = false
              this.$notify({
                title: this.$t('tip.successTitle'),
                message: intl('tip.sendSuccess'),
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      hanleDone(row) {
        this.$prompt(intl('tip.done'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          inputType: 'textarea',
          inputPlaceholder: intl('table.remark'),
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              if (!instance.inputValue) {
                this.$message.error(intl('tip.input'))
                return
              }
              done()
            } else {
              done()
            }
          }
        }).then(({ value }) => {
          feedbackDone({ id: row.id, handlerExplain: value }).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      },
      showDetail(row) {
        // const loading = this.$loading({
        //   lock: true,
        //   text: 'Loading',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // })
        feedbackFetchDetail({ id: row.id }).then(result => {
          // loading.close()
          console.log(result)
          this.tempInfo = result.data
          this.tempInfo.icons = []
          this.tempInfo.email = row.account_email
          this.tempInfo.pictureOne && this.tempInfo.icons.push(this.tempInfo.pictureOne)
          this.tempInfo.pictureTwo && this.tempInfo.icons.push(this.tempInfo.pictureTwo)
          this.tempInfo.pictureThree && this.tempInfo.icons.push(this.tempInfo.pictureThree)
          // this.tempInfo.icons = ['http://img3.redocn.com/20120410/Redocn_2012041007514574.jpg', 'http://img.sccnn.com/bimg/338/24556.jpg']
          this.dialogFormVisible = true
        })
      },
      getList() {
        this.listLoading = true
        feedbackFetchAll(this.query).then(result => {
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
      handleRemove(file, fileList) {
        console.log(file, fileList)
        this.tempInfo.addedFileList = fileList
      },
      handleSuccess(response, file, fileList) {
        this.tempInfo.addedFileList = fileList
      },
      handleFilter() {
        this.query.currPage = 1
        this.getList()
      }
    }
  }
</script>
<style scoped>
  .dialog-item {
    padding: 10px 0;
  }
  .record-label {
    font-size: 15px;
    margin-left: 15px;
    font-weight: bold;
  }
  .record-item {
    margin-bottom: 15px;
  }
</style>
