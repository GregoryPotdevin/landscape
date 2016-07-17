import React from "react"
import { Circle, Line } from 'rc-progress'
import 'rc-progress/assets/index.css'

export class Progress extends React.Component { 
  
  static propTypes = {
    shape: React.PropTypes.oneOf(["line", "circle"])
  }
  
  static defaultProps = {
    shape: "line",
    min: 0,
    max: 100,
    strokeColor: 'rgb(66, 165, 245)',
    strokeWidth: 2,
    fontSize: 48,
    showValue: false
  }
  
  render(){
    const { shape, width, strokeColor, strokeWidth, min, max, value, showValue, fontSize } = this.props
    const Component = (shape === "line") ? Line : Circle
    var percent = (min == max ? 0 : (100*(value-min))/(max-min))
    if (percent < 0) percent = 0
    else if (percent > 100) percent = 100
    return (
      <div style={{width, margin: 'auto'}}>
        <Component percent={percent} 
                    strokeWidth={strokeWidth}
                    strokeColor={strokeColor} />
        {showValue && (
          <div style={{position: 'absolute', 
                       top: '50%', left: '50%',
                       transform: 'translateX(-50%) translateY(-50%)', 
                       fontSize, color: strokeColor}}>
            {Math.round(percent) + '%'}
          </div>
        )}
      </div>
    )
  }
}
