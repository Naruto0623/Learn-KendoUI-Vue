<template>
  <div class="hello">
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
      :data-source-ref="'kendoDataSource'"
      :sortable='true'
      :scrollable='true'
      :pageable='pageables'
      :filterable="filterable"
      :column-menu='columnMenu'
      :columns="columns"
      :persistSelection='true'
      :noRecords='true'
      :messages="message"
      :edit='edit'
      :change='select'>
    </kendo-grid>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
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
          //是否有输入框
          input: true,
          //是否为数字
          numeric: true,
          //是否显示刷新按钮
          refresh: true,
          //每页显示条数
          pageSize: 5,
          //分页下拉框，可调整每页显示条数
          pageSizes: [5, 10, 50],
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
      }
    },
    methods: {
      //获取列表数据
      listGrid(res) {
        return res;
      },
      //前端自定义转化后端接口数据
      parse(response) {
        return response;
      },
      //获取列表总页数
      total(t) {
        return t.length;
      },
      //列表请求参数
      parameterMap (options, operation) {
        //当设置:server-paging='true',:server-sorting='true'和:server-filtering='true'时
        // options为控件的所有请求参数信息filter，page，pageSize，sort
        if (operation !== 'read' && options.models) {
          return { models: kendo.stringify(options.models) }
        }else {
          return options;
        }
      },
      edit(options, operation) {
        console.log(options);
        console.log(operation);
        alert('编辑回调');
      },
      select(options) {
        console.log(options);
        let selectList = [];
        selectList = options.sender.selectedKeyNames();
        console.log(selectList);
      }
    },
    created() {
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
          data: function (res) {
            let data = res.d.results.map(function (item,index,array) {
              return {ProductName: item.CustomerID};
            });
            return data;
          }
        }
      };
      this.columns[1].columns[0].filterable.dataSource = categoryinfoS;
    }
  }
</script>

<style scoped>

</style>
