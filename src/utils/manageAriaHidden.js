
const BLACKLIST = ['template', 'script', 'style'];

let isHidable = ({ nodeType, tagName }) =>
  nodeType === 1 && BLACKLIST.indexOf(tagName.toLowerCase()) === -1;

let siblings = (container, mount, cb) => {
  mount = [].concat(mount);

  [].forEach.call(container.children, node => {
    if (mount.indexOf(node) === -1 && isHidable(node)){
      cb(node);
    }
  });
};

export function ariaHidden(show, node){
  if (!node) {
    return;
  }
  if (show) { node.setAttribute('aria-hidden', 'true'); }
  else { node.removeAttribute('aria-hidden'); }
}

export function hideSiblings(container, mountNode){
  siblings(container, mountNode, node => ariaHidden(true, node));
}

export function showSiblings(container, mountNode){
  siblings(container, mountNode, node => ariaHidden(false, node));
}
