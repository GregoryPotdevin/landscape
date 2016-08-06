
export function parse(str){
  const lines = str.split('\n')
  const root = {
    children: []
  }
  const parents = [root]
  
  for (var i = 0; i < lines.length; i++) {
    var el = lines[i];
    if (el.length == 0) continue;
    var depth = 0;
    el = el.trim()
    while(el[0] === '-') {
      el = el.substring(1).trim()
      depth++;
    }
    const entry = { label: el.split('=')[0].trim()}
    const parent = parents[depth]
    parents[depth+1] = entry
    if (!parent.children) parent.children = [entry]
    else parent.children.push(entry)
  }
  return root
}
