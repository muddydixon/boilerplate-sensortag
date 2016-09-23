import React, {Component} from "react";

export default class MapDrawer extends Component {
  onDrawBegin(ev){
    console.log(ev);
  }
  onDrawEnd(ev){
    console.log(ev);
  }
  render(){
    const {width, height, padding} = this.props;
    return <div>
      <svg width={width + padding * 2} height={height + padding * 2}>
      <g width={width} height={height} transform={`translate(${padding}, ${padding})`}>
      <rect width={width} height={height} stroke={"black"} fill={"none"}
    onMouseDown={this.onDrawBegin.bind(this)}
    onMouseUp={this.onDrawEnd.bind(this)}
      />
      </g>
      </svg>
      </div>;
  }
};
