<template>
  <div>
    <el-button @click="add">增加</el-button>
    <el-table border>
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

    const add = ()=>{

    }

    return {
    }
  }
}
</script>

<style scoped lang="scss">
.mt-base {
  margin-top: 20px;
}
</style>
