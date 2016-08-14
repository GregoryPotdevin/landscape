import React from 'react'
import { Menu, MenuItem } from 'react-blazecss'
import { Icon } from './Icon'
import shallowCompare from 'react-addons-shallow-compare'

const KEYS = {
  UP: 38,
  DOWN: 40,
  ENTER: 13
}

const canUseDOM = true


class KeyHandler extends React.Component {

  static defaultProps = {
    keyEventName: "keydown"
  }

  constructor(props) {
    super(props);
    this.handleKey = this.handleKey.bind(this);
  }

  componentDidMount() {
    window.document.addEventListener(this.props.keyEventName, this.handleKey);
  }

  componentWillUnmount() {
    window.document.removeEventListener(this.props.keyEventName, this.handleKey);
  }

  render() {
    return null;
  }

  handleKey(event) {
    const {onKey} = this.props

    if (!onKey) {
      return
    }

    const {target} = event
    console.log('handleKey', event)

    if (target instanceof window.HTMLElement && isInput(target)) {
      const tagName = target.tagName
      if (tagName === 'INPUT' || tagName === 'TEXTAREA') return
    }

    onKey(event)
  }
}


class Panel extends React.Component {
  
  constructor(props){
    super(props)
    
    this.handleKey = this.handleKey.bind(this)
  }
  
  showComponentUpdate(nextProps, nextState){
    return shallowCompare(this, nextProps, nextState)
  }
  
  handleKey(e){
    const { panelIdx, data, selected, onSelect, onSelectPanel } = this.props
    const children = data.children || []
    console.log("handleKey", e)
    switch(e.key){
      case "ArrowUp": {
        e.preventDefault()
        e.stopPropagation()
        if (selected > 0) onSelect(panelIdx, selected-1)
        break
      }
      case "ArrowDown": {
        e.preventDefault()
        e.stopPropagation()
        if (selected < children.length-1) onSelect(panelIdx, selected+1)
        break
      } 
      case "ArrowLeft": {
        e.preventDefault()
        e.stopPropagation()
        onSelectPanel(panelIdx-1)
        break
      } 
      case "ArrowRight": {
        e.preventDefault()
        e.stopPropagation()
        onSelectPanel(panelIdx+1)
        break
      } 
      case "Enter": {
        break
      }
      default: {
        
      } 
    }
  }
  
  render(){
    const { panelIdx, width=200, height, data, selected, active=false, onSelect } = this.props
    return (
      <div style={{width, minWidth: width, display: 'table-cell'}}>
        {active && <KeyHandler onKey={this.handleKey} />}
        <Menu style={{width: '100%', height, maxHeight: height, margin: 0}}
              grouped>
          {(data.children || []).map((entry, idx) => {
            const icon = entry.children ? "folder" : "file"
            const activeItem = idx==selected
            let styles = undefined
            if (activeItem && active){
              styles = {
                backgroundColor: '#6ebaf7',
                color: 'white'
              }
            }
            return (
              <MenuItem key={idx}
                        active={activeItem} 
                        onClick={() => onSelect(panelIdx, idx)}
                        style={styles}>
                <Icon name={icon} /> {entry.label}
              </MenuItem>
            )
          })}
        </Menu>
      </div>
      
    )
  }
}

export class TreePanel extends React.Component {
  
  constructor(props){
    super(props)
    
    this.state = {
      panels: [{
        data: props.data,
        selected: undefined
      }]
    }
    
    this.handleSelect = this.handleSelect.bind(this)
    this.handleSelectPanel = this.handleSelectPanel.bind(this)
    this.scrollToEnd = this.scrollToEnd.bind(this)
  }
  
  scrollToEnd(){
      const el = this.refs.container
      // console.log("container", el.scrollWidth, el.clientWidth)
      if (el.scrollWidth > el.clientWidth){
        el.scrollLeft = el.scrollWidth - el.clientWidth;
      }
      // el.scrollLeft = el.scrollWidth - el.clientWidth;
  }
  
  handleSelectPanel(panelIdx){
    console.log("onSelectPanel", panelIdx)
    const { panels } = this.state
    if (panelIdx < 0 || panelIdx >= panels.length) return
    
    this.handleSelect(panelIdx, panels[panelIdx].selected || 0)
  }
  
  handleSelect(panelIdx, itemIdx) {
    const { panels } = this.state
    const remainingPanels = panels.slice(0, panelIdx)
    const item = {
      data: panels[panelIdx].data,
      selected: itemIdx
    }
    if (item.data.children[itemIdx].children){
      this.setState({
        lastFolder: remainingPanels.length,
        panels: [
          ...remainingPanels,
          item,
          { // Last column
            data: panels[panelIdx].data.children[itemIdx]
          }
        ]
      }, this.scrollToEnd)
    } else {
      this.setState({
        lastFolder: remainingPanels.length,
        panels: [
          ...remainingPanels,
          item,
        ]
      })
    }
  }
  
  render(){
    const { panels, lastFolder, columnWidth=200, height=300 } = this.state
    return (
      <div ref="container" style={{overflowX: 'scroll', height, border: '1px solid #ccc'}}>
        {panels.map((folder, panelIdx) => (
          <Panel  key={panelIdx} 
                  height={height}
                  panelIdx={panelIdx}
                  onSelect={this.handleSelect}
                  onSelectPanel={this.handleSelectPanel}
                  data={folder.data}
                  selected={folder.selected}
                  active={panelIdx == (lastFolder)} />
        ))}
      </div>
    )
  }
}
