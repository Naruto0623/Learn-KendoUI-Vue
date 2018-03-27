import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
//参考资料：http://blog.csdn.net/h5_queenstyle12/article/details/75386359
//vuex中存储常量的对象
const state = {
  age: 1,
  page: 3,
  title: 'Learn-Vuex',
  isBack: false,
  isPlus: false,
  isSearch: false,
  isTrash: false,
  isOk: false
};
//vuex中的计算属性
const getters = {
  pageSize: function ( state ){
    return state.page += 0;
  },
  headerStates: state => state
};
//vuex中同步改变state状态的函数对象
const mutations = {
  add( state, n ){
    debugger;
    state.age += n;
  },
  reduce( state ){
    state.age -= 1;
  },
  isAllHeader( state, type ){
    if (type == 'show') {
      state.isBack = true;
      state.isPlus = true;
      state.isSearch = true;
      state.isTrash = true;
      state.isOk = true;
    } else {
      state.isBack = false;
      state.isPlus = false;
      state.isSearch = false;
      state.isTrash = false;
      state.isOk = false;
    }
  },
  headerSetting( state, setting ){
    state = Object.assign(state, setting);
    document.title = state.title;
  }
};
//vuex中异步改变state状态的函数对象
const actions = {
  addAction( context ){
    //context 对象包含以下属性：
    /*{
        state,      // 等同于 `store.state`，若在模块中则为局部状态
        rootState,  // 等同于 `store.state`，只存在于模块中
        commit,     // 等同于 `store.commit`
        dispatch,   // 等同于 `store.dispatch`
        getters,    // 等同于 `store.getters`
        rootGetters // 等同于 `store.getters`，只存在于模块中
    }*/
    context.commit(reduce)
  },
  reduceAction( { commit } ){
    commit('reduce')
  },
  allHeader( { commit }, type ){
    commit('isAllHeader', type)
  }
};
//模块组
const moduleA = {
  state, mutations, getters, actions
};
export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
});
// export default new Vuex.Store({
//   modules: { a: moduleA }
// });
