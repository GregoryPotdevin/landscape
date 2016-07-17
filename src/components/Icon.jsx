import React from "react"
import cx from "classnames"
require("font-awesome-webpack")

// export class Icon extends React.Component {
//   render(){
//     const { icon, circle, spin, fontSize, opacity, onClick } = this.props
//     if (circle){
//       return (
//         <span className="fa-stack fa-lg" onClick={onClick} style={{fontSize, opacity}} >
//           <i className="fa fa-circle-o fa-stack-2x" />
//           <i className={"fa fa-" + icon + (spin ? " fa-spin" : "")} />
//         </span>
//       )
//     } else {
//       return <i className={"fa fa-" + icon + (spin ? " fa-spin" : "")} style={{fontSize, opacity}} onClick={onClick} />
//     }
//   }
// }

export class Icon extends React.Component {
  
  static defaultProps = {
    fixedWidth: true
  }
  
  render(){
    const { name, spin, fixedWidth, size, border, pullLeft, pullRight, 
      fontSize, color, stack, style={}, circle, onClick, opacity } = this.props
    
    if (circle){
      return (
        <span className={cx("fa-stack fa-lg", {
          "fa-pull-left": pullLeft,
          "fa-pull-right": pullRight
        })} onClick={onClick} style={{fontSize, opacity}} >
          <i className="fa fa-circle-o fa-stack-2x" />
          <i className={cx("fa fa-" + name + " fa-stack-1x", {
            "fa-spin": spin,
            "fa-fw": fixedWidth,
          })} />
        </span>
      )
    }
    
    return (
      <i className={"fa fa-" + name + " " + cx({
         "fa-spin": spin,
         "fa-fw": fixedWidth,
         ["fa-" + size + "x"]: !stack && size,
         ["fa-stack-" + size + "x"]: stack && size,
         "fa-border": border,
         "fa-pull-left": pullLeft,
         "fa-pull-right": pullRight
      })} style={{...style, fontSize, color}} onClick={onClick} />
    )
  }
}
