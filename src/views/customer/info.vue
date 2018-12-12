<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.accountStatus')请输入UID" v-model="query.id"></el-input>-->
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.account"></el-input>
      <el-select clearable style="width: 150px" class="filter-item" v-model="query.isFrozen" @change="handleFilter" :placeholder="$t('tip.accountStatus')">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" v-model="query.customerLevelId" :placeholder="$t('tip.customerPara')" @change="handleFilter">
        <el-option v-for="item in customerList" :key="item.id" :label="item.description" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable  style="width: 210px;" class="filter-item" v-model="query.merchantLevelId" :placeholder="$t('tip.merchantPara')" @change="handleFilter">
        <el-option v-for="item in merchantList" :key="item.id" :label="item.description" :value="item.id">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" v-model="query.agentLevelId" :placeholder="$t('tip.agentPara')" @change="handleFilter">
        <el-option v-for="item in agentList" :key="item.id" :label="item.description" :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">{{$t('table.query')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleActivity" type="warning">{{$t('table.activity')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <!--<el-table-column align="center" label="UID" width="50" prop="id"></el-table-column>-->
      <el-table-column align="center" :label="$t('table.email')" width="150" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.area_code')" width="100" prop="area_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.mobile_number')" width="120" prop="mobile_number"></el-table-column>
      <el-table-column align="center" :label="$t('table.accountStatus')" width="130">
        <template slot-scope="scope">
          <span>{{scope.row.is_frozen | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.customerLevel')" width="120" prop="customer_level"></el-table-column>
      <el-table-column align="center" :label="$t('table.customerLevelDesc')" width="120" prop="customer_level_description"></el-table-column>
      <el-table-column align="center" :label="$t('table.merchantLevel')" width="120" prop="merchant_level"></el-table-column>
      <el-table-column align="center" :label="$t('table.merchantLevelDesc')" width="120" prop="merchant_level_description"></el-table-column>
      <el-table-column align="center" :label="$t('table.agentLevelDesc')" width="120" prop="agent_level_description"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifier')" width="120" prop="modifier_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.modify_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" :label="$t('table.actions')" width="330" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="showDetail(scope.row)" style="width: 68px">{{$t('table.baseInfo')}}</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.is_frozen" size="mini" type="warning" @click="handleUnfrozen(scope.row)" style="width: 68px">{{$t('table.unfrozen')}}</el-button>
          <el-button v-else type="danger" size="mini" @click="handleFrozen(scope.row)">{{$t('table.frozen')}}</el-button>
          <el-button type="primary" size="mini" @click="adjustAsset(scope.row)" style="width: 74px">{{$t('table.adjustAsset')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="$t('table.baseInfo')" :visible.sync="detailDialogVisible">
      <div class="info" style="line-height: 3;">
        <el-row>
          <el-col :span="4">{{$t('table.full_name')}}:</el-col><el-col :span="6"> {{tempInfo.full_name}}</el-col>
          <el-col :span="4">{{$t('table.sex')}}:</el-col><el-col :span="6"> {{tempInfo.sex}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{$t('table.birthday')}}:</el-col><el-col :span="6"> {{tempInfo.birthday | parseTime('{y}-{m}-{d}')}}</el-col>
          <el-col :span="4">{{$t('table.postal_code')}}:</el-col><el-col :span="6"> {{tempInfo.postal_code}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{$t('table.city')}}:</el-col><el-col :span="6"> {{tempInfo.city}}</el-col>
          <el-col :span="4">{{$t('table.address')}}:</el-col><el-col :span="10"> {{tempInfo.address}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{$t('table.country_area_code')}}:</el-col><el-col :span="6"> {{tempInfo.area_code}}</el-col>
          <el-col :span="4">{{$t('table.country_abbr')}}:</el-col><el-col :span="6"> {{tempInfo.country_abbr}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{$t('table.country_name_chinese')}}:</el-col><el-col :span="6"> {{tempInfo.country_name_chinese}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{$t('table.mobile_number')}}:</el-col><el-col :span="6"> {{tempInfo.mobile_number}}</el-col>
          <el-col :span="4">{{$t('table.email')}}:</el-col><el-col :span="6"> {{tempInfo.email}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{$t('table.invitation_code')}}:</el-col><el-col :span="6"> {{tempInfo.invitation_code}}</el-col>
          <el-col :span="4">{{$t('table.agentInvitationCode')}}:</el-col><el-col :span="6"> {{tempInfo.agentInvitationCode}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">{{$t('table.certificatePic')}}:</el-col>
        </el-row>
        <PictureView v-if="detailDialogVisible" :pictureList="tempInfo.icons" width="50" height="50"></PictureView>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('table.edit')" :visible.sync="dialogFormVisible" class="slim-dialog">
      <el-form :rules="rules"  ref="updateForm" :model="temp" label-position="left" label-width="150px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.tradePara')" prop="customer_level_id">
          <el-select class="filter-item" v-model="temp.customer_level_id" :placeholder="$t('tip.select')">
            <el-option v-for="item in customerList" :key="item.id" :label="item.description" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.merchantParam')" prop="merchant_level_id">
          <el-select class="filter-item" v-model="temp.merchant_level_id" :placeholder="$t('tip.select')">
            <el-option v-for="item in merchantList" :key="item.id" :label="item.description" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.agentParam')" prop="agent_level_id">
          <el-select class="filter-item" v-model="temp.agent_level_id" :placeholder="$t('tip.select')">
            <el-option v-for="item in agentList" :key="item.id" :label="item.description" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('table.adjustAsset')" :visible.sync="adjustDialogVisible" class="slim-dialog">
      <el-form :rules="adjustRules"  ref="adjustForm" :model="adjustTemp" label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.coin')" prop="coinId">
          <el-select class="filter-item" v-model="adjustTemp.coinId" :placeholder="$t('tip.select')">
            <el-option v-for="item in coinList" :key="item.id" :label="item.coin_code" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isActivity" :label="$t('table.adjustType')" prop="type">
          <el-select class="filter-item" v-model="adjustTemp.type" :placeholder="$t('tip.select')">
            <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.adjustCount')" prop="quantity">
          <el-input-number v-model="adjustTemp.quantity" :precision="6" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('table.remark')" prop="info">
          <el-input type="textarea" :rows="5" :placeholder="$t('tip.input')" v-model="adjustTemp.info"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adjustDialogVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="adjustConfirm">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { infoFetchAll, infoUpdate, getCustomerList, getMerchantList,
    getAgentList, infoFrozen, infoUnfrozen, infoDetail, getCoinList, infoAdjustPlus, infoAdjustMinus, infoAdjustPlusAll } from '@/api/customer'
  import waves from '@/directive/waves' // 水波纹指令
  import imageView from 'vue-imageview'
  import PictureView from 'vue-simple-picture-preview'
  import { intl } from '@/utils'

  export default {
    name: 'deal',
    components: {
      'image-view': imageView,
      PictureView
    },
    filters: {
      statusFilter(isFrozen) {
        return isFrozen ? intl('map.frozen') : intl('map.normal')
      }
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
        temp: {
        },
        tempInfo: {},
        adjustTemp: {},
        dialogFormVisible: false,
        detailDialogVisible: false,
        adjustDialogVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('table.edit'),
          create: this.$t('table.add')
        },
        rules: {
          customer_level_id: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          merchant_level_id: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          agent_level_id: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        adjustRules: {
          coinId: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          type: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          quantity: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          info: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        updatingObj: '',
        statusList: [{
          id: true,
          label: this.$t('map.frozen')
        }, {
          id: false,
          label: this.$t('map.normal')
        }],
        typeList: [{
          id: 'plus',
          label: this.$t('map.adjustPlus')
        }, {
          id: 'minus',
          label: this.$t('map.adjustMinus')
        }],
        customerList: [],
        merchantList: [],
        agentList: [],
        coinList: [],
        isActivity: false
      }
    },
    created() {
      this.getList()
      this.getStaticData()
    },
    methods: {
      getStaticData() {
        getCustomerList().then(result => {
          this.customerList = result.data
        })
        getAgentList().then(result => {
          this.agentList = result.data
        })
        getMerchantList().then(result => {
          this.merchantList = result.data
        })
        getCoinList().then(result => {
          this.coinList = result.data
        })
      },
      getList() {
        this.listLoading = true
        infoFetchAll(this.query).then(result => {
          this.listLoading = false
          this.list = result.data
          this.total = result.pageInfo.totalCount
          if (this.list.length === 0 && this.query.currPage !== 1) {
            this.getList()
          }
        })
      },
      showDetail(row) {
        // const loading = this.$loading({
        //   lock: true,
        //   text: 'Loading',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // })
        infoDetail({ id: row.id }).then(result => {
          this.tempInfo = result.data.length ? result.data[0] : {}
          this.tempInfo.icons = []
          this.tempInfo.credential_front_pic_addr && this.tempInfo.icons.push(this.tempInfo.credential_front_pic_addr)
          this.tempInfo.credential_back_pic_addr && this.tempInfo.icons.push(this.tempInfo.credential_back_pic_addr)
          this.tempInfo.credential_sign_pic_addr && this.tempInfo.icons.push(this.tempInfo.credential_sign_pic_addr)
          this.tempInfo.full_name = row.full_name
          this.tempInfo.email = row.email
          this.tempInfo.mobile_number = row.mobile_number
          // loading.close()
          this.detailDialogVisible = true
        }).catch(e => {
          // loading.close()
        })
      },
      handleFilter() {
        this.query.currPage = 1
        this.getList()
      },
      handleUnfrozen(row) {
        this.$confirm(this.$t('tip.unfrozen'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          infoUnfrozen({ id: row.id }).then(res => {
            this.getList()
            this.$message({
              message: this.$t('tip.success'),
              type: 'success'
            })
          })
        })
      },
      handleFrozen(row) {
        this.$confirm(this.$t('tip.frozen'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          infoFrozen({ id: row.id }).then(res => {
            this.getList()
            this.$message({
              message: this.$t('tip.success'),
              type: 'success'
            })
          })
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
      handleUpdate(row) {
        this.updatingObj = row
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['updateForm'].clearValidate()
        })
      },
      getUpdatedObj(temp) {
        const newObj = { id: temp.id }
        Object.keys(temp).filter(attr => {
          return attr !== 'id'
        }).forEach(attr => {
          if (this.updatingObj[attr] !== temp[attr]) {
            newObj[attr] = temp[attr]
          }
        })
        return newObj
      },
      updateData() {
        this.$refs['updateForm'].validate((valid) => {
          if (valid) {
            const para = Object.assign({}, this.temp)
            infoUpdate(this.getUpdatedObj(para)).then((res) => {
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
      adjustAsset(row) {
        this.adjustTemp = {
          accountId: row.id
        }
        this.isActivity = false
        this.adjustRules.type[0].required = true
        this.adjustDialogVisible = true
      },
      handleActivity() {
        this.adjustTemp = {}
        this.isActivity = true
        this.adjustRules.type[0].required = false
        this.adjustDialogVisible = true
      },
      adjustConfirm() {
        this.$refs['adjustForm'].validate((valid) => {
          if (valid) {
            let action
            if (this.adjustTemp.type === 'plus') {
              action = infoAdjustPlus
            } else if (this.adjustTemp.type === 'minus') {
              action = infoAdjustMinus
            } else {
              action = infoAdjustPlusAll
            }
            action(this.adjustTemp).then((res) => {
              // this.getList()
              this.adjustDialogVisible = false
              this.$notify({
                title: this.$t('tip.successTitle'),
                message: this.$t('tip.success'),
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
