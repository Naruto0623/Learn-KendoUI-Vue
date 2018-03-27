<template>
  <div>
    <pubHeader></pubHeader>
    <h2>{{$store.state.age}}</h2>
    <h2>{{$store.getters.pageSize}}</h2>
    <button v-on:click="$store.commit('add',age)" class="btn btn-danger">+</button>
    <button v-on:click="$store.commit('reduce')" class="btn btn-primary">-</button>
    <hr>
    <button v-on:click="add(page)" class="btn btn-danger">+</button>
    <button v-on:click="reduce" class="btn btn-primary">-</button>
    <hr>
    <button v-on:click="addAction" class="btn btn-danger">+</button>
    <button v-on:click="reduceAction" class="btn btn-primary">-</button>
  </div>
</template>
<style scoped>

</style>
<script>
  import axios from 'axios'
  import pubHeader from './publicHead'
  import store from '@/vuex/store'
  import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
  // import * as type from "vuex"

  export default {
    data(){
      return {}
    },
    components: {
      pubHeader
    },
    computed: {
      //两种获取vuex中的state里值的办法
      //理解为传入state对象，修改state.count属性
      ...mapState({
        age: state => state.age
      }),
      //数组中直接写你需要获取的state中值的字段
      // ...mapState([ "page" ]),
      ...mapGetters([ "pageSize" ])
    },

    created(){

    },
    methods: {
      ...mapMutations([
        'add', 'reduce'
      ]),
      ...mapActions([
        'addAction', 'reduceAction'
      ])
    }
  }
</script>


