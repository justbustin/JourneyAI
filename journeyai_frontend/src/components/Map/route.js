import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = ({points}) => {

  console.log(points);

  const waypoints = points.map(point => L.latLng(point[0], point[1]));

  console.log(waypoints);

  const instance = L.Routing.control({
    waypoints: waypoints,
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false
  });

  return instance;
};

const Routing = createControlComponent(createRoutineMachineLayer);

export default Routing;
