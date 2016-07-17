import { widgets } from "./widgets"
import { uuid } from './utils'
import { extractKeys, findItems } from './utils/analyzeJson'

import findIndex from 'lodash/findIndex'
import find from 'lodash/find'
import clone from 'lodash/clone'
import SocketIO from 'socket.io-client'

const API = 'http://localhost:3000'

// var socket = SocketIO(API, {
//   path: '/ws', transports: ['websocket', 'polling']
// });


function insertAt(value, array, idx){
  return [...array.slice(0, idx), value, ...array.slice(idx)]
}

function remove(array, idx){
  array = array.slice()
  array.splice(idx, 1)
  return array
}

function autoBindFields(widget, dataLinks){
  console.log("autoBindFields", widget, dataLinks)
  if (dataLinks) {
    // Check for auto-bind properties...
    widgets[widget.$type].fields.forEach(field => {
      if (field.autoBind){
        const info = field.autoBind
        let prop
        if (info.field){
          prop = find(dataLinks.keys, {key: info.field})
        } else {
          prop = find(dataLinks.keys, {type: info.type})
        }
        if (prop) widget[field.name] = {
          $link: {
            id: dataLinks.id,
            key: prop.key
          }
        }
      }
    })
    console.log("=>", widget)
  }
}

export default class WidgetManager {
  
  constructor(id){
    this.pageId = id
    
    this.setRoot({
      "$type": "Page",
      id: uuid(),
      className: "pb-page",
      children: [{
        "$type": "Section",
        id: uuid(),
        className: "pb-section",
        children: []
      }]
    })
    
    this.onSelect = () => {}
    this.onRemove = () => {}
    this.onUpdate = () => {}
    this.onAdd = () => {}
    this.onData = () => {}
    this.onRemoteUpdate = () => {} 
  }
  
  initRemote(){
    this.socket = SocketIO(API, {
      path: '/ws', transports: ['websocket', 'polling'] // 'websocket', 
    });
    
    this.socket.on('news', ({msg}) => {
      console.log(msg);
    });
    
    this.socket.on('pb-add', ({pageId, widget, parentId, parentField, index}) => {
      console.log("received", "pb-add", widget, parentId, parentField, index)
      if (!parentId){
        console.log("Received root !!");
        this.setRoot(widget)
      } else {
        this.add(widget, parentId, parentField, index, false)
      }
      this.onRemoteUpdate()
    });
    
    this.socket.on('pb-move', ({pageId, widgetId, parentId, parentField, index}) => {
      this.add(this.get(widgetId), parentId, parentField, index, false)
      this.onRemoteUpdate()
    });
    
    this.socket.on('pb-update', ({pageId, widgetId, key, value}) => {
      this.update(this.get(widgetId), key, value, false)
      this.onRemoteUpdate()
    });
    
    this.socket.on('pb-remove', ({pageId, widgetId}) => {
      this.remove(widgetId, false)
      this.onRemoteUpdate()
    });
    this.socket.on('pb-init', ({pageId}) => {
      this.emit('pb-add', {pageId, widget: this.root})
      this.onRemoteUpdate()
    })
    this.socket.emit("register", {pageId: this.pageId})
  }
  
  emit(op, data){
    if (this.socket){
      console.log("emit", op, data)
      this.socket.emit(op, data)
    }
  }
  
  setRoot(root){
    this.root = root
    this.history = [this.root]
    this.widgetsById = this.computeWidgetsById(this.root)
  }
  
  computeWidgetsById(root){
    const widgetsById = {}
    
    function add(widget, parentId, parentField){
      widgetsById[widget.id] = {
        widget, parentId, parentField
      }  
      if (widget.children){
        widget.children.forEach(w => add(w, widget.id, "children"))
      }
    }
    add(root)
    
    return widgetsById
  }
  
  setState(id, state){
    console.log("setState", id, state)
    const info = this.widgetsById[id]
    if (!info) return
    
    this.widgetsById[id] = {
      ...info, state
    }
    this.onData()
  }
  
  getState(id){
    if (!(id in this.widgetsById)){
      return undefined 
    }
    return this.widgetsById[id].state
  }
  
  getTreeDataState(id){
    console.log("getTreeDataState", id)
    if (!(id in this.widgetsById)){
      return undefined 
    }
    const { state, parentId } = this.widgetsById[id]
    
    if (state && state) {
      return { id, data: state }
    } else if (parentId) {
      return this.getTreeDataState(parentId)
    } else {
      return undefined
    }
  }
  
  getItemDataLinks(id){
    if (!(id in this.widgetsById)){
      return undefined 
    }
    const treeData = this.getTreeDataState(this.widgetsById[id].parentId)
    console.log("treeData", treeData)
    if (!treeData) return undefined
    
    // Find items and extract keys :)
    const items = findItems(treeData.data)
    console.log("items", items)
    if (items && items.length > 0) return {
      id: treeData.id,
      keys: extractKeys(items[0])
    }
    return undefined
  }
  
  get(id){
    // console.log("get", id)
    if (!id || !(id in this.widgetsById)) return undefined
    return this.widgetsById[id].widget
  }
  
  bubbleChange(widget){
    const { parentId, parentField } = this.widgetsById[widget.id]
    if (parentId){
      const parent = this.get(parentId)
      if (Array.isArray(parent[parentField])){
        const array = parent[parentField].map(w => w.id == widget.id ? widget : w)
        this._update(parent, parentField, array) 
      } else {
        this._update(parent, parentField, widget)
      }
    } else {
      this.root = widget // finished
    }
  }
  
  ensureId(widget, parentId, parentField="children"){
    if (widget.id) return widget
    
    
    widget = clone(widget)
    widget.id = uuid()
    this.widgetsById[widget.id] = {
      widget, parentId, parentField
    }
    const dataLinks = this.getItemDataLinks(widget.id)
    console.log("ensureId", widget, dataLinks)
    if (dataLinks) {
      autoBindFields(widget, dataLinks)
    }
    
    if (widget.children){
      widget.children = widget.children.map(w => {
        return this.ensureId(w, widget.id, "children")
      })
    }
    return widget;
  }
  
  registerTree(widget, parentId, parentField="children"){
    this.widgetsById[widget.id] = {
      widget, parentId, parentField
    }
    if (widget.children){
      widget.children.forEach(w => (
        this.registerTree(w, widget.id, "children")
      ))
    }
  }
  
  clone(widgetId){
    // Strip all ids and add back to parent
    const {widget, parentId, parentField } = this.widgetsById[widgetId]
    if (!parentId) return
    
    function cloneWithoutId(widget){
      return {
        ...widget,
        id: undefined,
        children: widget.children ? widget.children.map(cloneWithoutId) : undefined
      }
    }
    
    const prevIdx = findIndex(this.get(parentId)[parentField], w => w.id == widgetId)
    var newWidget = cloneWithoutId(widget)
    this.add(newWidget, parentId, parentField, prevIdx+1)
  }
  
  add(widget, parentId, parentField="children", index=0, report=true){
    if (!widget.id){
      widget = this.ensureId(widget, parentId, parentField)
      if (report) this.emit('pb-add', {widget, parentId, parentField, index})
    } else if (widget.id in this.widgetsById){
      // Move !
      if (report) this.emit('pb-move', {widgetId: widget.id, parentId, parentField, index})
      widget = this.widgetsById[widget.id].widget // Ensure same...
      const prev = this.widgetsById[widget.id]
      if (parentId == prev.parentId){
        // Move in the same parent
        const prevChildren = this.get(parentId)[parentField]
        const prevIdx = findIndex(prevChildren, w => w.id == widget.id)
        if (index > prevIdx) index--; // Adjust index after removing
      }
      this._remove(widget.id)
    } else {
      // Register...
      this.registerTree(widget, parentId, parentField)
    }
    
    this.widgetsById[widget.id] = {
      widget,
      parentId,
      parentField
    }
    const parent = this.get(parentId)
    const children = insertAt(widget, parent[parentField], index)
    this._update(parent, parentField, children) 
    this.commit()
    if (report) this.onAdd(this.get(widget.id))
    // this.onRefreshRoot(this.root)
  }
  
  _remove(widgetId){
    const { parentId, parentField } = this.widgetsById[widgetId]
    const parent = this.get(parentId)
    if (!parent) return
   
    const prevChildren = parent[parentField]
    const idx = findIndex(prevChildren, w => w.id == widgetId)
    const children = remove(prevChildren, idx)
    delete this.widgetsById[widgetId]
    this._update(parent, parentField, children) 
  }
  
  _update(widget, field, value){
    // console.log("update", widget.id, field, value)
    const id = widget.id
    const prev = this.widgetsById[id]
    const newWidget = {
      ...widget,
      [field]: value
    }
    
    // Mutate for now, can be rebuilt if needed
    this.widgetsById[id] = {
      ...prev,
      widget: newWidget
    }
    this.bubbleChange(newWidget)
    // this.widgetsById = {
    //   ...this.widgetsById,
    //   [id]: {
    //     ...prev,
    //     widget
    //   }
    // }
  }
  
  remove(widgetId, report=true){
    if (report) this.emit('pb-remove', {widgetId})
    this._remove(widgetId)
    this.commit()
    if (report) this.onRemove(widgetId)
  }
  
  update(widget, field, value, report=true){
    if (report) this.emit('pb-update', {widgetId: widget.id, key: field, value})
    this._update(widget, field, value)
    this.commit()
    if (report) this.onUpdate(this.get(widget.id))
  }
  
  commit(){
    this.history.push(this.root)
    console.log('=> new root', this.root, this.widgetsById)
  }
  
  undo(){
    console.log("undo", this.history)
    if (this.history.length > 1){
      this.history.pop()
      this.root = this.history[this.history.length-1]
      this.widgetsById = this.computeWidgetsById(this.root)
      console.log('=> new root', this.root)
    }
  }
  
  select(widget){
    this.onSelect(widget)
  }
  
  getInfo(widget){
    return widgets[widget["$type"]]
  }
  
  getFields(widget){
    return this.getInfo(widget).fields
  }
  
  getParent(widget){
    if (!widget) return undefiend
    return this.get(this.widgetsById[widget.id].parentId)
  }
}
