import ReactDOM from 'react-dom';
/**
 * 获取容器组件
 * @param  {[type]} container        [description]
 * @param  {[type]} defaultContainer [description]
 * @return {[type]}                  [description]
 */
export default function getContainer(container, defaultContainer){
  container = typeof container === 'function' ? container() : container;
  return ReactDOM.findDOMNode(container) || defaultContainer;
}
