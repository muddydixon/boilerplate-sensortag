import React, {Component} from "react";
import MapDrawer from "./map-drawer";

export default class MapCreate extends Component {
  render(){
    return <div>
      <MapDrawer width={800} height={400} padding={10} />
      </div>;
  }
};
