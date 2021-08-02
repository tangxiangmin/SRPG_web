<template>
  <div>
    <el-row>
      <el-col :span="12">
        <GameMap :config="config" :key="mapKey" @click-cell="onCellClick"></GameMap>
      </el-col>
      <el-col :span="12">
        <el-form label-width="100px">
          <el-form-item label="地图尺寸">
            <el-input class="w100" v-model.number="row"/>
            /
            <el-input class="w100" v-model.number="col"/>
          </el-form-item>
          <el-form-item label="地形刷子">
            <el-select v-model="defaultCellType">
              <el-option :label="item.name" :value="item.id" v-for="item in cellList" :key="item.id"></el-option>
            </el-select>
            &nbsp;
            <el-switch v-model="quickConfigCellType"></el-switch> 开启后点击单元格会快速设置地图类型
            // todo 后续支持TileMap
          </el-form-item>
          <el-form-item label="剧情脚本">
            <el-input placeholder="todo"/>
          </el-form-item>
          <el-form-item label="结束条件">
            <el-input placeholder="todo"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="saveMapConfig">保存数据</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog
        title="配置单元格"
        v-model="dialogVisible"
        width="30%">
      <el-form label-width="100px">
        <el-form-item label="坐标">
          <el-input class="w100" v-model="currentCell.x" :disabled="true"/>
          /
          <el-input class="w100" v-model="currentCell.y" :disabled="true"/>
        </el-form-item>
        <el-form-item label="设置地形">
          <el-select v-model="currentCell.type">
            <el-option :label="item.name" :value="item.id" v-for="item in cellList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="初始棋子">
          <el-select v-model="currentCell.chessId">
            <el-option :label="item.name" :value="item.id" v-for="item in chessList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="棋子分组">
          <el-input v-model.number="currentCell.group"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveCellConfig">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {computed, reactive, ref} from "vue"
import {ElMessage} from 'element-plus'

import {getCellKey} from "../../core/Chessboard";
import {chessList, cellList} from "../../core/config/temp";

import GameMap from '../demo/chessboard.vue'

export function parseConfig(row, col, cellMap) {
  let grid = []
  let chessList = []
  for (let i = 0; i < row; ++i) {
    let line = []
    for (let j = 0; j < col; ++j) {
      const key = getCellKey(i, j)
      const cell = cellMap[key]
      if (cell) {
        const {type, chessId, group} = cell
        line.push(type)
        if (chessId) {
          chessList.push({
            chessId,
            x: i,
            y: j,
            group
          })
        }
      } else {
        line.push(1) // 默认地形
      }
    }
    grid.push(line)
  }

  return {
    grid,
    chessList
  }
}

export default {
  name: "index",
  components: {GameMap},
  setup() {

    const defaultCell = {
      type: 1,
      x: 0,
      y: 0,
      chessId: null,
      group: 1
    }

    const currentCell = reactive({
      ...defaultCell
    })

    const row = ref(10)
    const col = ref(10)

    const mapKey = ref('')

    const defaultCellType = ref(1)
    const quickConfigCellType = ref(false)

    const dialogVisible = ref(false)

    const onCellClick = ({x, y}) => {
      currentCell.x = x
      currentCell.y = y

      // 快速配置模式
      if(quickConfigCellType.value) {
        currentCell.type = defaultCellType.value
        saveCellConfig()
        return
      }

      dialogVisible.value = true
    }
    let map = reactive({})

    const saveCellConfig = () => {
      const {x, y} = currentCell
      const key = getCellKey(x, y)
      map[key] = {
        ...currentCell
      }
      dialogVisible.value = false
    }

    const config = computed(() => {
      // todo 临时使用随机key刷新地图
      mapKey.value = Math.random().toString()
      return parseConfig(row.value, col.value, map)
    })

    const saveMapConfig = () => {
      const config = parseConfig(row.value, col.value, map)
      ElMessage.success('数据已生成，请打开控制台复制')
      console.log(JSON.stringify(config))
    }

    return {
      cellList, chessList,
      defaultCellType, quickConfigCellType,
      config,
      currentCell,
      col, row,
      dialogVisible,
      mapKey,
      onCellClick,
      saveCellConfig,
      saveMapConfig
    }
  }
}
</script>

<style scoped lang="scss">
.w100 {
  width: 100px;
}
</style>
