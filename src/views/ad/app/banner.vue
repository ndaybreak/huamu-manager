<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.sortNum')" width="100" prop="sortNum"></el-table-column>
      <el-table-column align="center" :label="$t('table.pic')" width="150">
        <template slot-scope="scope">
          <img :src="scope.row.logo" style="width: 120px;" @click="showicon(scope.row)" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.lang')" width="100" prop="language">
        <template slot-scope="scope">
          <span>{{scope.row.language | languageFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.picLink')" width="200" prop="link"></el-table-column>
      <el-table-column align="center" :label="$t('table.remark')" width="300" prop="info"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifier')" width="150" prop="name"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="200" prop="modify_time">
        <template slot-scope="scope">
          <span>{{scope.row.operationTime | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status == 0" size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.discontinue')}}</el-button>
          <el-button v-if="scope.row.status == 1" size="mini" type="info" @click="handleRecover(scope.row)">{{$t('table.recover')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<div class="pagination-container">-->
    <!--<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">-->
    <!--</el-pagination>-->
    <!--</div>-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="slim-dialog">
      <el-form :rules="rules" ref="dataForm" :model="tempInfo" label-position="left" label-width="170px" style='width: 900px; margin-left:50px;'>
        <el-form-item :label="$t('table.sortNum')" prop="sortNum">
          <el-input-number v-model="tempInfo.sortNum" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.pic')" style="width: 600px;">
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            name="file"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span style="color: red;">{{$t('tip.picSize')}}：750*322pix</span>
        </el-form-item>
        <el-form-item :label="$t('table.lang')" prop="language">
          <el-select clearable class="filter-item" v-model="tempInfo.language" :placeholder="$t('tip.select')">
            <el-option v-for="item in languageList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.picLink')" prop="link">
          <el-input v-model="tempInfo.link" style="width: 243px;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.remark')" prop="info">
          <el-input type="textarea" style="width: 243px;" :rows="5" v-model="tempInfo.info"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else-if="dialogStatus=='update'" type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <!--图片查看-->
    <transition name="slide-fade" class="fadeView">
      <div v-if="showImg">
        <image-view :imgArr="imgArr"
                    :showImageView="true"
                    :imageIndex="0"
                    class="test"
                    v-on:hideImage="hideImageView"></image-view>
      </div>
    </transition>

  </div>
</template>

<script>
  import { getCoinList } from '@/api/customer'
  import { bannerFetchAll, bannerCreate, bannerUpdate, bannerDelete, bannerRecover } from '@/api/ad'
  import waves from '@/directive/waves' // 水波纹指令
  import imageView from 'vue-imageview'

  export default {
    name: 'coinTemplate',
    components: {
      'image-view': imageView
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
        languageList: [{
          id: 0,
          label: '中文'
        }, {
          id: 1,
          label: 'English'
        }],
        rules: {
          info: [{ required: false, message: this.$t('tip.select'), trigger: 'blur' }],
          language: [{ required: true, message: this.$t('tip.select'), trigger: 'blur' }],
          link: [{ required: false, message: this.$t('tip.select'), trigger: 'blur' }],
          sortNum: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        updatingObj: '',
        tradeList: [{
          id: true,
          label: this.$t('table.yes')
        }, {
          id: false,
          label: this.$t('table.no')
        }],
        coinList: [],
        marketCoinList: [],
        imgArr: [],
        showImg: false,
        imageUrl: '',
        uploadAction: ''
      }
    },
    created() {
      this.uploadAction = this.baseUrl + '/file/public/uploadImg?type=9'
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
        bannerFetchAll(this.query).then(result => {
          this.listLoading = false
          this.list = result.data
          // this.total = result.pageInfo.totalCount
          if (this.list.length === 0 && this.query.currPage !== 1) {
            this.getList()
          }
        })
      },
      showicon(row) {
        this.imgArr = [row.logo]
        this.showImg = true
      },
      hideImageView() {
        this.showImg = false
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
          bannerDelete(row.id).then(res => {
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
          targetCoinId: '',
          marketCoinId: '',
          sortNum: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.imageUrl = ''
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.imageUrl) {
              this.$message.error(this.$t('tip.icon'))
              return
            }
            this.tempInfo.logo = this.imageUrl
            bannerCreate(this.tempInfo).then(data => {
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
        this.imageUrl = this.tempInfo.logo
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.imageUrl) {
              this.$message.error(this.$t('tip.icon'))
              return
            }
            this.tempInfo.logo = this.imageUrl
            bannerUpdate(this.tempInfo, this.updatingObj).then((res) => {
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
          bannerRecover(row.id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
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
    margin-left: 60px;
  }
</style>
