<template>
  <div class="app-container">
    <el-row style="width: 900px;border: 1px solid gray;">
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
          <el-button @click="getCheckedNodes">get by node</el-button>
          <el-button @click="getCheckedKeys">get by key</el-button>
          <el-button @click="setCheckedNodes">set by node</el-button>
          <el-button @click="setCheckedKeys">set by key</el-button>
        </div>
      </el-col>
      <el-col :span="4">
        <div><el-button @click="checkAll">全选</el-button></div>
        <div><el-button @click="resetChecked">取消</el-button></div>
      </el-col>
      <el-col :span="10">
        <el-tree :data="dataSelected"
                 default-expand-all
                 :props="defaultProps"></el-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // 水波纹指令
  import { asyncRouterMap } from '@/router'
  import { deepClone, intl } from '@/utils'

  const formatMenus = (routerMap) => {
    routerMap.forEach(route => {
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
        dataSelected: [],
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created() {
      this.data = formatMenus(asyncRouterMap)
    },
    methods: {
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
        console.log(this.$refs.tree.getCheckedKeys())
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
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([1])
      },
      checkAll() {
        this.$refs.tree.setCheckedKeys([1, 2, 3])
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([])
      }
    }
  }
</script>
<style scoped>
  .item-right {
    margin-left: 60px
  }
</style>
