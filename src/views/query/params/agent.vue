<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input type="number" style="width: 200px;" class="filter-item" :placeholder="$t('tip.id')" v-model="query.queryId"></el-input>
      <el-select clearable style="width: 200px" class="filter-item" v-model="query.changeType" @change="handleFilter" :placeholder="$t('tip.changeType')">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.changeContent')" v-model="query.changeContent"></el-input>
      <el-input type="number" style="width: 200px;" class="filter-item" :placeholder="$t('tip.modifierId')" v-model="query.modifierId"></el-input>
      <el-date-picker v-model="query.startTime" class="filter-item" type="datetime" :placeholder="$t('tip.startTime')"></el-date-picker>
      <el-date-picker v-model="query.endTime" class="filter-item" type="datetime" :placeholder="$t('tip.endTime')"></el-date-picker>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="center" :label="$t('table.changeStatus')" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.change_type | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.changeContent')" width="650" prop="change_content"></el-table-column>
      <el-table-column align="center" label="ID" width="120" prop="agent_level_id"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifierId')" width="180" prop="modifier_id"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifier')" width="180" prop="modifier_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.modify_time | parseTime}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { agentLevelLog } from '@/api/query'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime, intl } from '@/utils'

  export default {
    name: 'customerLog',
    directives: {
      waves
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: intl('map.create'),
          1: intl('map.modify'),
          2: intl('map.del'),
          3: intl('table.recover')
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        list: null,
        listLoading: true,
        total: null,
        query: {
          currPage: 1,
          pageSize: 15
        },
        statusList: [{
          id: 0,
          label: intl('map.create')
        }, {
          id: 1,
          label: intl('map.modify')
        }, {
          id: 2,
          label: intl('map.del')
        }, {
          id: 3,
          label: intl('table.recover')
        }]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        const para = Object.assign({}, this.query)
        if (para.startTime) {
          para.startTime = parseTime(para.startTime)
        }
        if (para.endTime) {
          para.endTime = parseTime(para.endTime)
        }
        agentLevelLog(para).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      handleFilter() {
        this.query.currPage = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.query.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.query.currPage = val
        this.getList()
      }
    }
  }
</script>
<style scoped>

</style>
