import React, {Component} from "react";
import MapAction from "../actions/map-action";

export default class MapDrawer extends Component {
  constructor(props){
    super(props);
    this.state = {
      isDrawing: false,
      x: null,
      y: null,
      pathes: [],
      curr: [],

      isMarking: false,
      markers: [],

      isCalibrate: false,
      calibratePoints: [],

      // padding + border (stroke width)
      offset: {x: this.props.padding + 1, y: this.props.padding + 1}
    };
  }

  getCursor(){
  }

  onMapSave(){
    const {pathes, markers} = this.state;
    MapAction.save({
      pathes,
      markers
    }).then(map => console.log(map));
  }

  onMapClick(ev){
    const x = ev.nativeEvent.offsetX - this.state.offset.x;
    const y = ev.nativeEvent.offsetY - this.state.offset.y;
    const {curr, pathes} = this.state;

    if(this.state.isDrawing){
    }else{

      this.setState({
        isDrawing: true
      });
    }

    const currentPath = curr.length === 0 ? (()=>{
      const path = [];
      pathes.push(path);
      return path;
    })() : pathes[pathes.length - 1];
    currentPath.push({x, y});

    console.log(currentPath);
    this.setState({
      pathes: pathes
    });
  }
  onMapMove(ev){
    if(!this.state.isDrawing) return null;

    const [x, y] = [ev.nativeEvent.offsetX - this.state.offset.x, ev.nativeEvent.offsetY - this.state.offset.y];
    const lastPoint = this.state.pathes[this.state.pathes.length - 1];
    console.log(lastPoint);
    console.log({x, y});
    // this.setState({
    //   curr: [lastPoint, {x, y}].filter(d => d)
    // });
  }

  createPath(arr){
    return "M" + arr.map(p => `${p.x},${p.y}`).join("L");
  }

  render(){
    const {width, height, padding} = this.props;
    return <div className="container">
      <div className="row">
      <svg ref="svg" width={width + padding * 2} height={height + padding * 2}
        onClick={this.onMapClick.bind(this)}
        style={{cursor: this.getCursor()}}
      >
      <g width={width} height={height} transform={`translate(${padding}, ${padding})`}>
      <rect width={width} height={height} stroke={"black"} fill={"none"} />
      {this.state.pathes.map( (path, id) => <path key={id} d={this.createPath(path)} stroke={"black"} />)}
      {this.state.markers.map( (marker, id) => <circle key={id} cx={marker.x} cy={marker.y} r={10} fill={marker.fill} />)}
      </g>
      </svg>
      </div>
      <div className="row">
      <button className="btn btn-info" onClick={this.onMapSave.bind(this)}>Save Map</button>&nbsp;
      </div>
      </div>;
  }
};
