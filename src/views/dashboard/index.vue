<template>
  <div class="dashboard-container">
    <!--<component :is="currentRole"></component>-->
    <img src='../../assets/home.png'>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
<style scoped>
  .dashboard-container {
    background-color: #edf1f2;
    text-align: center;
    height: 100%;
    padding-top: 100px;
  }
</style>
