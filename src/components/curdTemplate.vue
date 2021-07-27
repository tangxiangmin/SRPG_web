
<script lang="jsx">

import {defineComponent,h} from 'vue'
// const noop = () => {
//   return Promise.resolve(false)
// }

// const add = noop
// const edit = noop
// const remove = noop
// const getList = noop

const config =  {
  name: 'CurdTemplate',
  props: {
    defaultForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    api: {
      type: Object,
      default: () => {
        return {
          add: null,
          edit: null,
          remove: null,
          getList: null
        }
      }
    },
    addText: {
      type: String,
      default: '新增'
    },
    searchParams: {
      type: Object,
      default: null
    },
    pageSize: {
      type: Number,
      default: 15
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    tableOptions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    immediateSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      isLoading: false,
      dialogFormVisible: false,
      form: Object.assign({}, this.defaultForm)
    }
  },
  created() {
    if (this.immediateSearch) {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      this.isLoading = true
      // 约定getList接口返回{list, total}
      this.api.getList && this.api.getList(this.searchParams).then(res => {
        if (!res) return
        const { list, total } = res
        this.list = Array.isArray(list) ? list : []
        this.total = total
      }).finally(() => {
        this.isLoading = false
      })
    },
    editRow(row) {
      this.dialogFormVisible = true
      this.form = row
    },
    removeRow(row) {
      this.$confirm('确认删除？').then(() => {
        const index = this.list.indexOf(row)
        this.api.remove(row[this.rowKey]).then(() => {
          this.list.splice(index, 1)
          this.$message.success('删除成功')
        })
      }).catch(() => {})
    },
    submitDialog() {
      let task
      const { form } = this
      const params = { ...form }
      if (params.$$isEdit) {
        task = this.api.edit
        delete params.$$isEdit // 移除无关字段
      } else {
        task = this.api.add
      }

      task(params).then(() => {
        this.$message.success('操作成功')
        this.fetchData()
        this.hideDialog()
      })
    },
    addRow() {
      this.dialogFormVisible = true
    },
    showDialog() {
      this.dialogFormVisible = true
    },
    hideDialog() {
      this.dialogFormVisible = false
      this.form = Object.assign({}, this.defaultForm)
    },
    changePageNum(page) {
      this.searchParams.page = page
      this.fetchData()
    }
  },
  render(props, config) {
    return (<div>hello</div>)
    console.log(config)

    const { addText } = this
    console.log(this.$scopedSlots)

    const searchForm = this.$scopedSlots.search && this.$scopedSlots.search({ params: this.searchParams, getList: this.fetchData, list: this.list })
    const form = (<el-form inline>
      {
        this.api.add ? (<el-form-item>
          <el-button type='primary' v-on:click={this.showDialog}>
            {addText}
          </el-button>
        </el-form-item>) : null
      }
      { searchForm }
    </el-form>)

    const tableIndex = h('el-table-column', {
      props: {
        label: '序号',
        width: '50'
      },
      scopedSlots: {
        default: ({ $index }) => {
          return ($index + 1)
        }
      }
    })

    const tableAction = h('el-table-column', {
      props: {
        label: '操作'
      },
      scopedSlots: {
        default: ({ row }) => {
          const tableActionSlot = this.$scopedSlots.tableAction && this.$scopedSlots.tableAction({ row })
          return (
              <div>
                {this.api.edit ? (<el-button size='mini' v-on:click={this.editRow.bind(this, row)}>编辑</el-button>) : null}
                {this.api.remove ? (<el-button size='mini' type='danger' v-on:click={this.removeRow.bind(this, row)}>删除</el-button>) : null}
                {tableActionSlot}
              </div>)
        }
      }
    })

    const showAction = this.api.edit || this.api.remove || this.$scopedSlots.tableAction

    const table = h('el-table', {
      directives: [{ name: 'loading', value: this.isLoading }],
      props: {
        border: true,
        data: this.list,
        ...this.tableOptions
      }
    }, [this.showIndex ? tableIndex : null, ...this.$scopedSlots.table(), showAction ? tableAction : null])

    let dialog

    if (this.dialogFormVisible) {
      if (typeof this.form.$$isEdit === 'undefined') {
        this.form.$$isEdit = !!this.form[this.rowKey]
      }
      const editForm = h('el-form', {
        props: {
          labelWidth: '120px'
        }
      }, this.$scopedSlots.form({ form: this.form, isEdit: this.form.$$isEdit }))

      const dialogFooter = (<div slot='footer'>
        <el-button v-on:click={this.hideDialog}>取消</el-button>
        <el-button type='primary' v-on:click={this.submitDialog}>确定</el-button>
      </div>)
      dialog = h('el-dialog', {
        props: {
          title: this.form.$$isEdit ? '编辑' : '新增',
          visible: this.dialogFormVisible
        },
        on: {
          'update:visible': (val) => {
            this.dialogFormVisible = val
          }
        }
      }, [editForm, dialogFooter])
    }

    const pagination = this.total ? h('div', {
      attrs: {
        class: ['curd-pagination']
      }
    }, [h('el-pagination', {
      props: {
        background: true,
        layout: 'total, prev, pager, next',
        total: this.total,
        pageSize: this.pageSize
      },
      on: {
        'current-change': this.changePageNum
      }
    })]) : null

    return h('div', {}, [form, table, dialog, pagination])
  }
}

export default defineComponent(config)
</script>

<style scoped lang="scss">
.curd-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
