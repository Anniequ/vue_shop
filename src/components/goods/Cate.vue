<template>
  <div>
    <!-- 面包屑导航区域 -->
    <template>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog"> 添加分类 </el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效  slot指定模板的名字-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot-scope="scope" slot="order">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options指定数据源 props用来指定配置对象,
          默认下拉框太大了，global.css中设置
          -->
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="ParentCateChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类的数据列表，默认为空
      cateList: [],
      total: 0, // 总数据条数
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将当前列定义模板
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          // 将当前列定义模板
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 将当前列定义模板
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类对话框是否可见
      addCateDialogVisible: false,
      // 添加分类的表单数据
      addCateForm: {
        cat_name: '',
        cat_pid: 0, // 父级分类id
        cat_level: 0 // 分类等级。默认为一级
      },
      // 添加分类的表单数据规则
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类的列表
      parentCateList: [],
      // 级联选择器选中项绑定值
      selectedKeys: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true // 每一级都可以选择。默认只有随后一级可以选择
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$http.get('categories', { params: this.queryInfo }).then(({ data }) => {
        if (data.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.cateList = data.data.result
        this.total = data.data.total
      })
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 打开添加分类对话框
    showAddDialog() {
      // 先获取父级分类的数据列表再打开对话框
      this.getParentCateList()
      this.addCateDialogVisible = true
    },

    // 获取父级分类列表
    getParentCateList() {
      this.$http.get('categories', { params: { type: 2 } }).then(({ data }) => {
        if (data.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.parentCateList = data.data
      })
    },
    // 选择项发生变化
    ParentCateChange() {
      // selectedKeys数组中的length大于0，选中了父级分类，反之没有任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级的类id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前类级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级的类id
        this.addCateForm.cat_pid = 0
        // 当前类级
        this.addCateForm.cat_level = 0
      }
    },
    // 监听表单关闭事件，清空表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 点击按钮添加类
    addCate() {
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) return
        this.$http.post('categories', this.addCateForm).then(({ data }) => {
          if (data.meta.status !== 201) return this.$message.error('新增商品分类失败')
          this.$message.success('新增商品分类成功')
          this.getCateList()
          this.addCateDialogVisible = false
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
