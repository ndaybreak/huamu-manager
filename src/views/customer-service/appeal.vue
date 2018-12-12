<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="query.appealTime" @change="appealSortChange" :placeholder="$t('tip.appealTime')">
        <el-option v-for="item in appealTimeSortList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable style="width: 220px" class="filter-item" v-model="query.updateTime" @change="updateSortChange" :placeholder="$t('tip.appealUpdateTime')">
        <el-option v-for="item in updateTimeSortList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="query.status" @change="handleFilter" :placeholder="$t('tip.appealStatus')">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable style="width: 200px" class="filter-item" v-model="query.orderStatus" @change="handleFilter" :placeholder="$t('tip.orderStatus')">
        <el-option v-for="item in orderStatusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="min-height:500px;">
      <el-table-column align="center" :label="$t('table.appealTime')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.appeal_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.appealUpdateTime')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.update_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.appealStatus')" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.appealStatus | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.appealNo')" width="100" prop="code"></el-table-column>
      <!--<el-table-column align="center" label="申诉原因" width="180">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.appeal_reason | reasonFilter}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" :label="$t('table.orderStatus')" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.order_status | orderStatusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.tradeCoin')" width="150" prop="coin_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.tradeValue')" width="150" prop="frozen_balance">
        <template slot-scope="scope">
          <span>{{scope.row.quantity | calculateTotal(scope.row.price)}} {{scope.row.legalCode}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.operator')" width="150" prop="name"></el-table-column>
      <el-table-column align="center" :label="$t('table.operationTime')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.operate_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button round @click="showDetail(scope.row)">{{$t('table.orderDetail')}}</el-button>
          <el-button v-if="scope.row.order_status === 5" type="primary" size="mini" @click="handleCancelOrder(scope.row)" style="width: 66px">{{$t('table.cancelOrder')}}</el-button>
          <el-button v-if="scope.row.order_status === 5" size="mini" type="success" @click="handleTransferMoney(scope.row)" style="width: 66px">{{$t('table.orderDone')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="查看" :visible.sync="dialogFormVisible">
      <h2>{{$t('table.appealNo')}}：{{tempInfo.rowCode}}</h2>
      <el-row>
        <el-col :span="12">
          <div class="dialog-item">{{$t('table.orderStatus')}}：{{tempInfo.type | orderTypeFilter}}</div>
          <div class="dialog-item">{{$t('table.orderNo')}}：{{tempInfo.order_no}}</div>
          <div class="dialog-item">{{$t('table.tradeQuantity')}}：{{tempInfo.quantity}}</div>
          <div class="dialog-item">{{$t('table.merchantAccount')}}：{{tempInfo.merchant.email}}</div>
          <div class="dialog-item">{{$t('table.merchantPhone')}}：{{tempInfo.merchant.mobile_number}}</div>
          <div class="dialog-item">{{$t('table.analogueAccount')}}：{{tempInfo.client.email}}</div>
          <div class="dialog-item">{{$t('table.analoguePhone')}}：{{tempInfo.client.mobile_number}}</div>
        </el-col>
        <el-col :span="12">
          <div class="dialog-item">{{$t('table.adNo')}}：{{tempInfo.advert_no}}</div>
          <div class="dialog-item">{{$t('table.tradeCoin')}}：{{tempInfo.coin_code}}</div>
          <div class="dialog-item">{{$t('table.tradeValue')}}：{{tempInfo.quantity | calculateTotal(tempInfo.price)}} {{tempInfo.legalCode}}</div>
          <div class="dialog-item">{{$t('table.merchantEmail')}}：{{tempInfo.merchant.email}}</div>
          <div class="dialog-item">&nbsp;</div>
          <div class="dialog-item">{{$t('table.analogueEmail')}}：{{tempInfo.client.email}}</div>
        </el-col>
      </el-row>
      <h2>{{$t('table.appealRecord')}}</h2>
      <div class="record-item" v-for="item in tempInfo.detailList">
        <div class="record-title">* {{item.detail_create_time | parseTime}} <span class="record-label">{{item.new_status | newStatusFilter}}</span></div>
        <div class="record-content">{{$t('table.content')}}： {{item.content}}</div>
        <div class="record-img">
          <PictureView v-if="dialogFormVisible" :pictureList="getPictureList(item.appealDetailList)" width="50" height="50" :key="new Date().getTime()"></PictureView>
        </div>
      </div>
      <div v-if="tempInfo.order_status != 1" class="opinion-wrap">
        <h2>{{$t('table.addOpinion')}}</h2>
        <el-input type="textarea" :rows="3" v-model="tempInfo.addedOpinion" :label="$t('tip.input')"></el-input>
        <el-upload
          class="upload-demo"
          :action="uploadAction"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="tempInfo.uploadImgList"
          list-type="picture">
          <el-button size="small" type="primary">{{$t('table.click_to_upload')}}</el-button>
          <div slot="tip" class="el-upload__tip" style="display: inline-block;margin-left: 16px;">{{$t('table.picSize5M')}}</div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button v-if="tempInfo.order_status != 1" type="primary" @click="addOpinion">{{$t('table.addOpinion')}}</el-button>
        <el-button v-else @click="dialogFormVisible=false">{{$t('table.close')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { appealFetchAll, appealFetchDetail, appealAddOpinion, appealCancelOrder, appealTansferMoney } from '@/api/customerService'
  import waves from '@/directive/waves' // 水波纹指令
  import PictureView from 'vue-simple-picture-preview'
  import { intl } from '@/utils'

  export default {
    name: 'appealProcess',
    components: {
      PictureView
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: intl('map.appealing'),
          2: intl('map.appealDone')
        }
        return statusMap[status]
      },
      orderStatusFilter(status) {
        const statusMap = {
          1: intl('map.done'),
          2: intl('map.canceled'),
          3: intl('map.notPay'),
          4: intl('map.payed'),
          5: intl('map.appealing')
        }
        return statusMap[status]
      },
      calculateTotal(count, price) {
        if (isNaN(count) || isNaN(price)) {
          return ''
        } else {
          return ((count * price).toFixed(2) * 100).toFixed(0) / 100
        }
      },
      newStatusFilter(status) {
        const map = {
          1: intl('map.addByBuyer'),
          2: intl('map.addBySeller'),
          3: intl('map.addByAdmin'),
          4: intl('map.appealDone')
        }
        return map[status]
      },
      orderTypeFilter(type) {
        const map = {
          1: intl('map.merchantBuy'),
          2: intl('map.merchantSell')
        }
        return map[type]
      }
    },
    directives: {
      waves
    },
    data() {
      return {
        uploadAction: '',
        tempInfo: {
          icons: ['http://img3.redocn.com/20120410/Redocn_2012041007514574.jpg', 'http://img.sccnn.com/bimg/338/24556.jpg'],
          full_name: '',
          uploadImgList: [],
          addedOpinion: '',
          addedFileList: [],
          appealDetailList: [],
          merchant: {},
          client: {}
        },
        list: null,
        total: null,
        listLoading: true,
        query: {
          currPage: 1,
          pageSize: 15,
          status: '',
          orderStatus: '',
          appealTime: 'true',
          updateTime: ''
        },
        dialogFormVisible: false,
        statusList: [{
          id: 1,
          label: intl('map.appealing')
        }, {
          id: 2,
          label: intl('map.appealDone')
        }],
        orderStatusList: [{
          id: 1,
          label: intl('map.done')
        }, {
          id: 2,
          label: intl('map.canceled')
        }, {
          id: 3,
          label: intl('map.notPay')
        }, {
          id: 4,
          label: intl('map.payed')
        }, {
          id: 5,
          label: intl('map.appealing')
        }],
        appealTimeSortList: [{
          id: 'false',
          label: intl('map.appealDateAsc')
        }, {
          id: 'true',
          label: intl('map.appealDateDesc')
        }],
        updateTimeSortList: [{
          id: 'false',
          label: intl('map.appealUpdateDateAsc')
        }, {
          id: 'true',
          label: intl('map.appealUpdateDateDesc')
        }]
      }
    },
    created() {
      this.uploadAction = this.baseUrl + '/file/public/uploadImg?type=9'
      this.getList()
    },
    methods: {
      getPictureList(list = []) {
        const result = []
        list.forEach(item => {
          result.push(item.picture_address)
        })
        return result
      },
      handleCancelOrder(row) {
        this.$confirm(intl('tip.cancelOrder'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          appealCancelOrder(row.order_id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      },
      handleTransferMoney(row) {
        this.$confirm(intl('tip.orderDone'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          appealTansferMoney(row.order_id).then(res => {
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
        appealFetchDetail({ id: row.id, appealAccountId: row.appeal_account_id }).then(result => {
          const detailList = result.data.appealDetailMapList
          if (detailList.length > 0) {
            this.tempInfo = Object.assign({}, detailList[0])
          } else {
            this.tempInfo = {}
          }
          if (result.data.client) {
            this.tempInfo.client = result.data.client[0]
            this.tempInfo.merchant = {
              isClaimant: true,
              email: result.data.claimant[0].claimant_email,
              mobile_number: result.data.claimant[0].claimant_mobile_number
            }
          } else {
            this.tempInfo.client = {
              isClaimant: true,
              email: result.data.claimant[0].claimant_email,
              mobile_number: result.data.claimant[0].claimant_mobile_number
            }
            this.tempInfo.merchant = result.data.merchant[0]
          }

          this.tempInfo.detailList = detailList
          this.tempInfo.addedFileList = []
          this.tempInfo.uploadImgList = []
          this.tempInfo.rowCode = row.code
          // loading.close()
          this.dialogFormVisible = true
        }).catch(e => {
          // loading.close()
        })
      },
      getList() {
        this.listLoading = true
        appealFetchAll(this.query).then(result => {
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
      addOpinion() {
        if (!this.tempInfo.addedOpinion) {
          this.$message.error(intl('tip.content'))
        } else {
          let picList = []
          this.tempInfo.addedFileList.forEach(file => {
            picList.push(file.response.data.fileUrl)
          })
          picList = '[' + picList.join(',') + ']'
          const para = {
            id: this.tempInfo.appealId,
            content: this.tempInfo.addedOpinion,
            pictureAddresses: picList
          }
          if (this.tempInfo.client.isClaimant) {
            para.email = this.tempInfo.client.email
            para.mobileNumber = this.tempInfo.client.mobile_number
            para.analogueEmail = this.tempInfo.merchant.email
            para.analogueMobileNumber = this.tempInfo.merchant.mobile_number
          } else {
            para.email = this.tempInfo.merchant.email
            para.mobileNumber = this.tempInfo.merchant.mobile_number
            para.analogueEmail = this.tempInfo.client.email
            para.analogueMobileNumber = this.tempInfo.client.mobile_number
          }
          appealAddOpinion(para).then(result => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.showDetail({ id: this.tempInfo.appealId, appeal_account_id: this.tempInfo.appeal_account_id })
          })
        }
      },
      appealSortChange() {
        console.log(this.query.appealTime)
        if (this.query.appealTime !== '') {
          this.query.updateTime = ''
        }
        this.getList()
      },
      handleFilter() {
        this.query.currPage = 1
        this.getList()
      },
      updateSortChange() {
        console.log(this.query.updateTime)
        if (this.query.updateTime !== '') {
          this.query.appealTime = ''
        }
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
