<template>
  <div class="hello">
    <kendo-datasource ref="kendoDataSource"
                      :transport-read-url="readUrl"
                      :transport-read-data-type="'jsonp'"
                      :server-Paging="true"
                      :server-Sorting="true"
                      :server-Filtering="true"
                      :transport-parameter-schema="schemaModel"
                      :schema-data="listGrid"
                      :transport-parameter-fields="schemaModelFields"
                      :schema-model-id="'ProductID'"
                      :batch='true'
                      :page-size="'5'">
    </kendo-datasource>
    <kendo-grid
      :data-source-ref="'kendoDataSource'"
      :sortable='true'
      :pageable='pageables'
      :filterable="filterable"
      :column-menu='columnMenu'
      :columns="columns"
      :persistSelection="true"
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
        readUrl: 'https://demos.telerik.com/kendo-ui/service/Products',
        columnMenu: {
          messages: {
            sortAscending: "升序",
            sortDescending: "降序",
            columns: '列',
            filter: '过滤',
            sort: '排序'
          }
        },
        filterable: {
          'extra': false,
          'messages': {
            info: '显示符合一下条件的行',
            cancel: "取消过滤",
            and: "且",
            or: "或",
            filter: "过滤",
            clear: "清除",
            selectedItemsFormat: "选中 {0} 条"
          },
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
        schemaModelFields: {
          ProductID: { editable: false, nullable: true },
          ProductName: { validation: { required: true } },
          UnitPrice: { type: 'number', validation: { required: true, min: 1 } },
          Discontinued: { type: 'boolean' },
          UnitsInStock: { type: 'number', validation: { min: 0, required: true } }
        },
        listData: [],
        schemaModel: {
          //  前端自定义转化后端接口数据
          parse: function(response) {
            debugger;
            var products = response.data.data.godownentryform;
            return products;
          },
          //总条数
          total: function(d) {
            debugger;
            return task_counts;
          }
        },
        pageables: {
          input: true,
          numeric: true,
          refresh: true,
          pageSize: 5,
          pageSizes: [5, 10, 50],
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
        columns: [
          {
            selectable: "row",
            width: "50px"
          },
          {
            title: "产品名称",
            field: "ProductName"
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
      listGrid:function(res) {
        debugger;
        console.log(res);
        return res;
      },
      total(d){
        // debugger;
        var count = d.count;
      },
      parameterMap (options, operation) {
        // if (operation !== 'read' && options.models) {
        //   return { models: kendo.stringify(options.models) }
        // }
        var parameter = {
          page: options.page,
          pageSize: options.pageSize,
          usertoken: options.usertoken,
          sort: options.sort,
          filter: options.filter
        };
        // return JSON.stringify(parameter);
        return parameter;
      },
      edit(options, operation) {
        console.log(options);
        console.log(operation);
        alert('编辑回调');
      },
      select(options) {
        console.log(options);
        var selectList = [];
        selectList = options.sender.selectedKeyNames();
        console.log(selectList);
      }
    }
  }
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
