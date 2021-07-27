<template>
  <div>
    <el-table>
      <el-table-column label="id"></el-table-column>
      <el-table-column label="name"></el-table-column>
    </el-table>
  </div>
</template>

<script>
// import CurdTemplate from '../../components/curdTemplate.vue'

export default {
  name: "chess",
  // components: {CurdTemplate},
  setup() {
    const api = {
      getList: () => {
        return Promise.resolve({list: [], total: 0})
      }
    }
    return {
      api
    }
  }
}
</script>

<style scoped>

</style>
