<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <span style="margin-left: 100px;color: #666666;">{{$t('table.category')}}：{{categoryName}}</span>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="left" :label="$t('table.title')" width="450" prop="title"></el-table-column>
      <el-table-column align="center" :label="$t('table.lang')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.language | languageFilter}}</span>
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
      <el-table-column align="center" :label="$t('table.is_recommend')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.is_recommend | bool2Ch}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="320" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.is_recommend" type="success" size="mini" @click="handleReconment(scope.row)" style="width: 70px;">{{$t('table.cancelRecommend')}}</el-button>
          <el-button v-else type="success" size="mini" @click="handleReconment(scope.row)" style="width: 88px;">{{$t('table.recommend')}}</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { helpListFetchAll, helpListDelete, helpRecomend } from '@/api/help'
  import waves from '@/directive/waves' // 水波纹指令
  import { intl } from '@/utils'

  export default {
    name: 'helpList',
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
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('table.edit'),
          create: this.$t('table.add'),
          copy: this.$t('table.copy')
        },
        rules: {
          title: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }],
          language: [{ required: true, message: this.$t('tip.input'), trigger: 'blur' }]
        },
        updatingObj: '',
        coinFeeTemplateList: [],
        coinList: [],
        isEdit: false,
        categoryName: ''
      }
    },
    created() {
      this.query.id = this.$route.query.categoryId
      this.categoryName = this.$route.query.categoryName
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        helpListFetchAll(this.query).then(result => {
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
          helpListDelete(row.id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      },
      handleReconment(row) {
        const tip = row.is_recommend ? intl('tip.cancelRecommend') : intl('tip.recommend')
        this.$confirm(tip, this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          const para = {
            id: row.id,
            isRecommend: !row.is_recommend
          }
          helpRecomend(para).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      },
      handleCreate() {
        this.$router.push({
          path: 'help-detail',
          query: {
            categoryId: this.$route.query.categoryId,
            categoryName: this.$route.query.categoryName
          }
        })
      },
      handleFilter() {
        this.query.currPage = 1
        this.getList()
      },
      handleUpdate(row) {
        this.$router.push({
          path: 'help-detail',
          query: {
            titleId: row.id,
            categoryId: this.$route.query.categoryId,
            categoryName: this.$route.query.categoryName
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
