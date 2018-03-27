<template>
  <div>
    <header>
      <div style="float: left;" v-if="headerStates.isBack">
        <i class="glyphicon glyphicon-menu-left"></i>
      </div>
      <div v-if="headerStates.isPlus">
        <i class="glyphicon glyphicon-plus"></i>
      </div>
      <div v-if="headerStates.isSearch">
        <i class="glyphicon glyphicon-search"></i>
      </div>
      <div v-if="headerStates.isTrash">
        <i class="glyphicon glyphicon-trash"></i>
      </div>
      <div v-if="headerStates.isOk">
        <i class="glyphicon glyphicon-ok"></i>
      </div>
    </header>
  </div>
</template>
<style scoped>
  header {
    height: 66px;
    background-color: #d9534f;
    padding: 0 10px;
  }
  header > div {
    float: right;
  }
  header > div .glyphicon{
    padding: 0 20px;
    line-height: 66px;
    font-size: 18px;
    color: #fff;
  }
</style>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'

  export default {
    data(){
      return {
        setHeader: {
          title: 'Learn1',
          isBack: true,
          isPlus: false,
          isSearch: false,
          isTrash: false,
          isOk: true
        }
      }
    },
    computed: {
      ...mapGetters({
        headerStates: 'headerStates'
      })
    },

    created(){
      this.allHeader('show');
      this.headerSetting(this.setHeader);
    },
    methods: {
      ...mapActions({
        allHeader: 'allHeader'
      }),
      ...mapMutations({
        headerSetting: 'headerSetting'
      })
    }
  }
</script>


