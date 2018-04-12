<template>
  <div class="hello">
    <h2>{{$store.state.count}}</h2>
    <a class="btn btn-primary" v-on:click="openTree">树状图模态框</a>
    <a class="btn btn-success" v-on:click="refshGrid">刷新</a>
    <a class="btn btn-primary" style="margin: 20px auto;" data-toggle="modal" href="#gridModal">
      表格模态框
    </a>
    <div>
      <kendo-datasource
        ref="kendoDataSource"
        :transport-read-url="readUrl"
        :transport-read-type="'get'"
        :transport-read-contentType="'application/json; charset=utf-8'"
        :transport-read-data-type="'jsonp'"
        :server-paging='true'
        :server-sorting='true'
        :server-filtering='true'
        :transport-parameter-map="parameterMap"
        :transport-parameter-fields="schemaModelFields"
        :schema-model-id="'ProductID'"
        :schema-data="listGrid"
        :schema-parse="parse"
        :schema-total="total"
        :batch='true'
        :page-size='5'>
      </kendo-datasource>
      <kendo-grid
        ref="kendoGrid"
        :data-source-ref="'kendoDataSource'"
        :sortable='true'
        :scrollable='true'
        :pageable='pageables'
        :filterable="filterable"
        :column-menu='columnMenu'
        :columns="columns"
        :persistSelection='true'
        :noRecords='true'
        :height="600"
        :reorderable="true"
        :messages="message"
        :change='select'>
      </kendo-grid>
    </div>
    <!--预览照片-->
    <div class="modal fade" role="dialog" id="assetImgModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content" style="width:900px;left: -160px;">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <p>照片</p>
          </div>
          <div class="modal-body" style="overflow: auto;max-height: 450px;">
            <div>
              <img src="" alt="" id="assetUrl" width="100%">
            </div>
          </div>
          <div class="modal-footer">
            <!--<button type="button" class="btn btn-primary" v-if="!isAddD" v-on:click="createDep('使用地')">提交</button>-->
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    </div>
    <!--表格模态框-->
    <div class="modal fade" id="gridModal">
      <div class="modal-dialog" style="width: 1000px;">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" style="font-weight: 900;">模态框表格</h4>
          </div>
          <div class="modal-body" style="max-height: 500px;overflow-y: auto;">
            <div>
              <kendo-datasource
                ref="kendoDataSourceModal"
                :transport-read-url="readUrl"
                :transport-read-type="'get'"
                :transport-read-contentType="'application/json; charset=utf-8'"
                :transport-read-data-type="'jsonp'"
                :server-paging='true'
                :server-sorting='true'
                :server-filtering='true'
                :transport-parameter-map="parameterMap"
                :transport-parameter-fields="schemaModelFields"
                :schema-model-id="'ProductID'"
                :schema-data="listGrid"
                :schema-parse="parse"
                :schema-total="total"
                :batch='true'
                :page-size='5'>
              </kendo-datasource>
              <kendo-grid
                :data-source-ref="'kendoDataSourceModal'"
                :sortable='true'
                :scrollable='true'
                :pageable='pageables'
                :filterable="filterable"
                :column-menu='columnMenu'
                :columns="modalColumns"
                :persistSelection='true'
                :noRecords='true'
                :height="400"
                :messages="message"
                :change='select'>
              </kendo-grid>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary">保存</button>
          </div>
        </div>
      </div>
    </div>
    <!--树状图模态框-->
    <div class="modal fade" id="modal-tree">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">树状图</h4>
          </div>
          <div class="modal-body">
            <div v-if="isTree" style="padding: 0 20px;overflow-y: auto;max-height: 400px">
              <kendo-treeview
                :data-source="treeData"
                :data-text-field="'text'"
                :checkboxes="false"
                :drag-and-drop="false"
                :auto-scroll="true"
                @select="onSelect">
              </kendo-treeview>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import '@progress/kendo-ui/js/kendo.grid'
  import '@progress/kendo-ui/js/kendo.treeview'
  import '@progress/kendo-theme-default/dist/all.css'
  import { DataSource } from '@progress/kendo-datasource-vue-wrapper'
  import { Grid } from '@progress/kendo-grid-vue-wrapper'
  import { TreeView } from '@progress/kendo-treeview-vue-wrapper'
  import store from '@/vuex/store'
  var Vm = '';
  export default {
    name: 'HelloWorld',
    data(){
      return {
        //列表加载读取接口
        readUrl: '',
        //每列菜单配置
        columnMenu: {
          messages: {
            sortAscending: "升序",
            sortDescending: "降序",
            columns: '列',
            filter: '过滤',
            sort: '排序'
          }
        },
        //过滤的配置
        filterable: {
          //设置是否为双输入框
          'extra': false,
          //汉化过滤信息
          'messages': {
            info: '显示符合一下条件的行',
            cancel: "取消过滤",
            and: "且",
            or: "或",
            filter: "过滤",
            clear: "清除",
            selectedItemsFormat: "选中 {0} 条"
          },
          //定义过滤方式
          operators: {
            //字符串型
            string: {
              contains: "包含", //包含
              doesnotcontain: "不包含",  //不包含
              eq: "等于",    //等于
              neq: "不等于",   //不等于
              startswith: "开头为",  //开头为
              endswith: "结尾为"    //结尾为
            },
            //数值型
            number: {
              eq: "等于",   //等于
              neq: "不等于",    //不等于
              gte: "大于等于",//大于等于
              gt: "大于",//大于
              lte: "小于等于",//小于等于
              lt: "小于"//小于
            },
            //日期类型
            date: {
              eq: "等于",
              neq: "不等于",
              gte: "大于等于",
              gt: "大于",
              lte: "小于等于",
              lt: "小于"
            },
          }
        },
        //此属性与复选框冲突，不可同时使用，且只有为row的时候change函数中才能获得对应行的id
        selectable: "multiple, cell",
        //定义每个字段值的类型，包括可以设置最小/大值，是否可以修改，是否为必填验证等
        schemaModelFields: {
          ProductID: { editable: false, nullable: true },
          ProductName: { validation: { required: true } },
          UnitPrice: { type: 'number', validation: { required: true, min: 1 } },
          Discontinued: { type: 'boolean' },
          UnitsInStock: { type: 'number', validation: { min: 0, required: true } }
        },
        //分页配置
        pageables: {
          //是否有页码输入框
          input: true,
          //是否为数字
          numeric: true,
          //是否显示刷新按钮
          refresh: true,
          //每页显示条数
          pageSize: 5,
          //显示页码数字，超出显示省略号
          buttonCount: 5,
          //可选则每页显示多少条
          pageSizes: [ 5, 20, 50, 100 ],
          //分页信息汉化配置
          messages: {
            display: "{0} - {1} 共 {2} 条数据",
            empty: "没有数据",
            page: "页",
            of: "/ {0}",
            itemsPerPage: "条每页",
            first: "第一页",
            previous: "前一页",
            next: "下一页",
            last: "最后一页",
          }
        },
        //提示区域自定义文字需配合:noRecords='true'一起使用
        message: {
          noRecords: "当前页面上没有数据"
        },
        //列表列
        columns: [
          //复选框列，必须配合:persistSelection='true'一起使用才能勾选
          {
            selectable: "row",
            width: "50px"
          },
          {
            title: "基本信息",
            //可以为每列的标题自定义设置样式，且可以把几列归为一组
            headerAttributes: {
              style: 'text-align: center;font-weight:600;'
            },
            columns: [
              {
                title: "商品名称",
                field: "ProductName",
                //为当前列定义宽度，给每一列都定义宽度后表格会出现X轴滚动条
                width: 250,
                headerAttributes: {
                  style: 'text-align: center;'
                },
                attributes: { //给当前列添加属性
                  "class": "table-cell",
                  "style": "text-align: center;color: red; font-size: 14px"
                },
                filterable: {
                  'multi': true,
                  'checkAll': true,
                  //当列为复选框过滤时，复选框里的项可以通过接口请求
                  dataSource: {}
                }
              },
              {
                title: "商品价格",
                field: "UnitPrice"
              }
            ]
          },
          {
            title: "产品售卖信息",
            //可以为每列的标题自定义设置样式，且可以把几列归为一组
            headerAttributes: {
              style: 'text-align: center;font-weight:600;'
            },
            columns: [
              {
                title: "价格",
                field: "UnitPrice"
              },
              {
                title: "资产编码",
                field: "UnitsInStock"
              },
              {
                title: "入库单号",
                field: "Discontinued"
              }
            ]
          },
          {
            title: "价格",
            field: "UnitPrice",
            //定义当前列返回值中不显示html
            encoded: false,
            //为当前列的表头th添加样式
            headerAttributes: {
              //为当前表头th添加class名
              class: "text-center",
              //为当前表头th添加style样式
              style: 'font-weight: 900'
            },
            //为当前列td添加样式，可计算
            attributes: {
              class: "text-center",
              style: "#=Discontinued == true ? 'font-weight: 900;font-size: 24px;' : '' #"
            },
            template: "<span>#=UnitPrice+ '元' # </span>"
          },
          {
            title: '照片',
            field: 'ProductID',
            //可以为当前列的单元格绑定事件，传参可以把整个一行的数据都传过去
            template: "<div class='assetImg' onclick='window.openImg(#= kendo.stringify(data) #)' ><img height='50px' width='100%' src=# if(data.ProductID > 1 || data.ProductID == 1){#'http://ezg.lenovo.com.cn:8001/upload/defultImg.png'#} else {#'#: ProductID#'#} #></div>",
            width: '150px'
          },
          {
            title: "资产编码",
            field: "UnitsInStock"
          },
          {
            title: "商品库存",
            field: "Discontinued",
            attributes: {
              class: "text-center",
              style: "#=Discontinued == true ? '' : 'color:red;' #"
            },
            //定义当前列的模板
            template: "<strong>#=Discontinued == true ? '有' : '无' # </strong>"
          }
        ],
        modalColumns: [
          //复选框列，必须配合:persistSelection='true'一起使用才能勾选
          {
            selectable: "row",
            width: "50px"
          },
          {
            title: "基本信息",
            //可以为每列的标题自定义设置样式，且可以把几列归为一组
            headerAttributes: {
              style: 'text-align: center;font-weight:600;'
            },
            columns: [
              {
                title: "商品名称",
                field: "ProductName",
                //为当前列定义宽度，给每一列都定义宽度后表格会出现X轴滚动条
                width: 250,
                headerAttributes: {
                  style: 'text-align: center;'
                },
                attributes: { //给当前列添加属性
                  "class": "table-cell",
                  "style": "text-align: center;color: red; font-size: 14px"
                },
                filterable: {
                  'multi': true,
                  'checkAll': true,
                  //当列为复选框过滤时，复选框里的项可以通过接口请求
                  dataSource: {}
                }
              },
              {
                title: "商品价格",
                field: "UnitPrice",
                width: 150
              }
            ]
          },
          {
            title: "产品售卖信息",
            //可以为每列的标题自定义设置样式，且可以把几列归为一组
            headerAttributes: {
              style: 'text-align: center;font-weight:600;'
            },
            columns: [
              {
                title: "价格",
                field: "UnitPrice",
                width: 150
              },
              {
                title: "资产编码",
                field: "UnitsInStock",
                width: 150

              },
              {
                title: "入库单号",
                field: "Discontinued",
                width: 150

              }
            ]
          },
          {
            title: "价格",
            field: "UnitPrice",
            width: 150,
            //定义当前列返回值中不显示html
            encoded: false,
            //为当前列的表头th添加样式
            headerAttributes: {
              //为当前表头th添加class名
              class: "text-center",
              //为当前表头th添加style样式
              style: 'font-weight: 900'
            },
            //为当前列td添加样式，可计算
            attributes: {
              class: "text-center",
              style: "#=Discontinued == true ? 'font-weight: 900;font-size: 24px;' : '' #"
            },
            template: "<span>#=UnitPrice + '元' # </span>"
          },
          {
            title: '照片',
            field: 'ProductID',
            //可以为当前列的单元格绑定事件，传参可以把整个一行的数据都传过去
            template: "<div class='assetImg' onclick='window.openImg(#= kendo.stringify(data) #)' ><img height='50px' width='100%' src=# if(data.ProductID > 1 || data.ProductID == 1){#'http://ezg.lenovo.com.cn:8001/upload/defultImg.png'#} else {#'#: ProductID#'#} #></div>",
            width: '150px'
          },
          {
            title: "资产编码",
            field: "UnitsInStock",
            width: 150
          },
          {
            title: "商品库存",
            field: "Discontinued",
            width: 150,
            attributes: {
              class: "text-center",
              style: "#=Discontinued == true ? '' : 'color:red;' #"
            },
            //定义当前列的模板
            template: "<strong>#=Discontinued == true ? '有' : '无' # </strong>"
          }
        ],
        //树状图数据
        treeData: {},
        //树状图选中节点信息
        checkNode: {
          id: '',
          pid: '',
          name: ''
        },
        //是否加载显示树状图
        isTree: false
      }
    },
    components: {
      'kendo-datasource': DataSource,
      'kendo-grid': Grid,
      'kendo-treeview': TreeView
    },
    methods: {
      //刷新grid数据
      refshGrid() {
        //获取ajax组件节点
        var kendoData = this.$refs.kendoDataSource.kendoWidget();
        //刷新数据
        kendoData.read();
        kendoData.fetch();
        //获取表格组件节点
        var kendoGrid = this.$refs.kendoGrid.kendoWidget();
        //清楚表格选中数据
        kendoGrid.clearSelection()
      },
      //获取列表数据
      listGrid( res ){
        return res;
      },
      //前端自定义转化后端接口数据
      parse( response ){
        return response;
      },
      //获取列表总页数
      total( t ){
        return t.length;
      },
      //列表请求参数
      parameterMap( options, operation ){
        //当设置:server-paging='true',:server-sorting='true'和:server-filtering='true'时
        // options为控件的所有请求参数信息filter，page，pageSize，sort
        if (operation !== 'read' && options.models) {
          return { models: kendo.stringify(options.models) }
        } else {
          return options;
        }
      },
      //选中表格单行事件
      select( options ){
        console.log(options);
        let selectList = [];
        selectList = options.sender.selectedKeyNames();
        console.log(selectList);
      },
      //打开树状图模态框
      openTree(){
        $("#modal-tree").modal();
        this.treeList();
      },
      //树状图获取数据
      treeList(){
        let list = [
          {
            "text": "IT固定资产",
            "id": "96746e31-df32-4952-b11d-764bc1c5b2dc",
            "expanded": true,
            "spritecssclass": "rootfolder",
            "smallvalue": null,
            "deprecition": null,
            "categorycode": 8,
            "items": [
              {
                "text": "服务器",
                "id": "2c9cffc1-04a3-465a-b358-946cb19693f9",
                "expanded": true,
                "smallvalue": null,
                "deprecition": null,
                "categorycode": 1,
                "spritecssclass": "asseticon",
                "pid": "96746e31-df32-4952-b11d-764bc1c5b2dc"
              },
              {
                "text": "路由交换",
                "id": "3ad48ab2-6bdf-4b43-9e7b-1b3a547f52b5",
                "expanded": true,
                "smallvalue": null,
                "deprecition": null,
                "categorycode": 3,
                "spritecssclass": "asseticon",
                "pid": "96746e31-df32-4952-b11d-764bc1c5b2dc"
              },
              {
                "text": "存储",
                "id": "3efa68b6-1546-4153-9aa6-b190cd5fb872",
                "expanded": true,
                "smallvalue": null,
                "deprecition": null,
                "categorycode": 2,
                "spritecssclass": "asseticon",
                "pid": "96746e31-df32-4952-b11d-764bc1c5b2dc"
              },
              {
                "text": "投影",
                "id": "45c7d05d-2420-4376-a158-9e80218ce0f3",
                "expanded": true,
                "smallvalue": null,
                "deprecition": null,
                "categorycode": 5,
                "spritecssclass": "asseticon",
                "pid": "96746e31-df32-4952-b11d-764bc1c5b2dc"
              },
              {
                "text": "软件",
                "id": "4f9adb93-a178-4407-9ac3-0aa8439813f8",
                "expanded": true,
                "smallvalue": null,
                "deprecition": null,
                "categorycode": 7,
                "spritecssclass": "asseticon",
                "pid": "96746e31-df32-4952-b11d-764bc1c5b2dc"
              },
              {
                "text": "笔记本",
                "id": "600c9b7f-686d-418e-87a3-8260e3148e17",
                "expanded": true,
                "smallvalue": null,
                "deprecition": null,
                "categorycode": 11,
                "spritecssclass": "asseticon",
                "pid": "96746e31-df32-4952-b11d-764bc1c5b2dc"
              },
              {
                "text": "打印扫描",
                "id": "71d53b1e-a633-4265-9953-750f55190fae",
                "expanded": true,
                "smallvalue": null,
                "deprecition": null,
                "categorycode": 4,
                "spritecssclass": "asseticon",
                "pid": "96746e31-df32-4952-b11d-764bc1c5b2dc"
              },
              {
                "text": "显示器",
                "id": "7333031f-5e62-4b5f-a8b2-8f8c57d97725",
                "expanded": true,
                "smallvalue": null,
                "deprecition": null,
                "categorycode": 10,
                "spritecssclass": "asseticon",
                "pid": "96746e31-df32-4952-b11d-764bc1c5b2dc"
              },
              {
                "text": "台式机",
                "id": "a4b1ccc3-5367-4eac-8a7b-008fb60a1583",
                "expanded": true,
                "smallvalue": null,
                "deprecition": null,
                "categorycode": 9,
                "spritecssclass": "asseticon",
                "pid": "96746e31-df32-4952-b11d-764bc1c5b2dc"
              },
              {
                "text": "办公手机",
                "id": "dfcac5a0-bd03-4dfa-acbb-69603f30faf5",
                "expanded": true,
                "spritecssclass": "asseticon",
                "smallvalue": null,
                "deprecition": null,
                "categorycode": 6,
                "items": [
                  {
                    "text": "2",
                    "id": "57fcabff-0d65-11e8-8c84-7cd30ac4c634",
                    "expanded": true,
                    "smallvalue": null,
                    "deprecition": null,
                    "categorycode": 17,
                    "spritecssclass": "asseticon",
                    "pid": "dfcac5a0-bd03-4dfa-acbb-69603f30faf5"
                  }
                ],
                "pid": "96746e31-df32-4952-b11d-764bc1c5b2dc"
              }
            ],
            "pid": "0"
          }
        ];
        this.treeData = list;
        this.isTree = true;
      },
      //选中节点获取数据
      onSelect( ev ){
        let dataItem = ev.sender.dataItem(ev.node);
        this.checkNode.id = dataItem.id;
        this.checkNode.pid = dataItem.pid;
        this.checkNode.pid = dataItem.pid;
        this.checkNode.name = dataItem.text;
        console.dir(this.checkNode);
      },
    },
    created(){
      //把this赋值给Vue外部的变量
      Vm = this;
      this.readUrl = "https://demos.telerik.com/kendo-ui/service/Products";
      this.selectUrl = "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders";
      // this.readUrl = "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders";
      let categoryinfoS = {
        type: "odata",
        transport: {
          read: {
            url: this.selectUrl,
            dataType: "jsonp"
          }
        },
        schema: {
          //返回值
          data: function ( res ){
            let data = res.d.results.map(function ( item, index, array ){
              return { ProductName: item.CustomerID };
            });
            return data;
          }
        }
      };
      this.columns[ 1 ].columns[ 0 ].filterable.dataSource = categoryinfoS;
    }
  }
  $(function (){
    window.openImg = function openImg( url ){
      //在Vue外部获取this
      console.log(Vm);
      if (!(url == '' || url == null)) {
        $("#assetUrl").attr('src', url);
        $("#assetImgModal").modal();
      }
    };
  });
</script>
<style scoped>
  .k-grid td {
    border-bottom-width: 1px;
  }
</style>
