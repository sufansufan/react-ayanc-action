import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";

//翻看Redux的源码，可以发现
// createStore, combineReducers, bindActionCreators, applyMiddleware, compose 五个接口
// combineReducers 辅助函数的作用是，把一个由多个不同 reducer 函数作为 value 的 object，合并成一个最终的 reducer 函数，然后就可以对这个 reducer 调用 createStore。
// bindActionCreators  是通过dispatch将action包裹起来，这样可以通过bindActionCreators创建的方法，直接调用dispatch(action)(隐式调用）
// 主要用处：一般情况下，我们可以通过Provider将store通过React的connext属性向下传递，bindActionCreators的唯一用处就是需要传递action creater到子组件，并且改子组件并没有接收到父组件上传递的store和dispatch。
// applyMiddleware 在applyMiddleware里有可以不用立刻对store.dispatch赋值啦,可以直接赋值给一个变量dispatch，作为middleware的参数传递下去 ,进行一部分。 dispatch一个action,就会到达reducer，而middleware就是允许我们在dispatch action之后，到达reducer之前，搞点事情比如：打印，报错，跟异步API通信等等
// compose 从右到左来组合多个函数。这是函数式编程中的方法，为了方便，被放到了 Redux 里。 当需要把多个 store 增强器 依次执行的时候，需要用到它。
import { createStore, applyMiddleware } from "redux";

//redux-thunk中间件可以让action创建函数先不返回一个action对象，而是返回一个函数，函数传递两个参数(dispatch,getState),在函数体内进行业务逻辑的封装
// 像 redux-thunk 或 redux-promise 这样支持异步的 middleware 都包装了 store 的 dispatch() 方法
import thunkMiddleware from "redux-thunk"; // redux中间键

import { createLogger } from "redux-logger"; //用来打印日志
import { AppContainer } from "react-hot-loader";
import { selectSubreddit, fetchPostsIfNeeded } from "./action";

/* 组件 */
import App from "./App";
import rootReducer from "./reducer";

/* css */
import "./index.css";

const loggerMiddleware = createLogger();

//注入redux
//applyMiddleware 和Middleware 区别
/**
 * 你可以使用 applyMiddleware() 来增强 createStore()。虽然这不是必须的，但是它可以帮助你用简便的方式来描述异步的 action
 *
 * */

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // 允许我们 dispatch() 函数
    loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
  )
);
store.dispatch(selectSubreddit("reactjs"));
store
  .dispatch(fetchPostsIfNeeded("reactjs"))
  .then(() => console.log(store.getState()));
//每次state更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
// const unsubscribe = store.subscribe(() => console.log(store.getState()));
// unsubscribe();

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
