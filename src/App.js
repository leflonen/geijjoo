import React from "react"
const fetch = require("isomorphic-fetch");
const {
    compose,
    withProps,
    withHandlers,
   // withStateHandlers
} = require("recompose");
const FaAnchor = require("react-icons/lib/fa/anchor");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,
    TrafficLayer
} = require("react-google-maps");

const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

const StyledMapWithAMarkerClusterer = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBkBrkFqSna6gn9WzSNqDJT8K-DFot1Fzk&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    // withStateHandlers(() => ({
    //     isOpen: false,
    // }), {
    //     onToggleOpen: ({isOpen}) => () => ({
    //         isOpen: !isOpen,
    //     })
    // }),
    withHandlers({
        onMarkerClustererClick: () => (markerClusterer) => {
        },
        onToggleOpen: () => (marker) => {
            console.log(marker)
        },
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={13}
        defaultCenter={{ lat: 61.49911, lng: 23.78712 }}
    >
        <MarkerClusterer
            onClick={props.onMarkerClustererClick}
            averageCenter
            enableRetinaIcons
            gridSize={60}
        >
            {props.markers.map(marker => (
                <Marker
                    //onClick={props.onToggleOpen}   // This opens up every marker
                    onClick={() => props.onToggleOpen(marker)}  // This does nothing(?)
                    key={marker.id}
                    position={{ lat: parseFloat(marker.field_longitude), lng: parseFloat(marker.field_latitude) }}
                >
                    {props.isOpen && <InfoWindow
                        //onCloseClick={props.onToggleOpen} // same as above
                        onCloseClick={() => props.onToggleOpen}
                    >
                        <FaAnchor />
                    </InfoWindow>}
                </Marker>
            ))}
        </MarkerClusterer>
        <TrafficLayer autoUpdate />
    </GoogleMap>
);

export default class App extends React.PureComponent {

    componentWillMount() {
        this.setState({ markers: [] })
    }

    componentDidMount() {
        const url = "http://dropa.asuscomm.com/api/devices-and-detectors";

        fetch(url, {method: 'GET', headers:{ 'Accept':'application/x-www-form-urlencoded', 'Content-Type':'application/x-www-form-urlencoded',}})
            .then(res => res.json())
            .then(data => {
                this.setState({ markers: data });
            });
    }

    render() {
        return (
            <StyledMapWithAMarkerClusterer markers={this.state.markers} />
        )
    }
}
