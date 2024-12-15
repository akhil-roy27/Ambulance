import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components'
import mapboxgl from '!mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ291dGhhbS0wOCIsImEiOiJjbTRweWJ2NTMwdnk0MnRxc3gwc284a2doIn0.wM2RRtMAJNPxfZI3odHnzA';

export const Map = (props) => {
    const [userLocation, setUserLocation] = useState(null);
    const [map, setMap] = useState(null);

    // Get user's current location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([
                        position.coords.longitude,
                        position.coords.latitude
                    ]);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    // Initialize map
    useEffect(() => {
        const initializeMap = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: userLocation || [76.5222, 9.5916],
            zoom: 15,
        });

        // Save map instance
        setMap(initializeMap);

        // Add geolocate control to the map
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        });
        initializeMap.addControl(geolocate);

        // Clean up on unmount
        return () => initializeMap.remove();
    }, []); // Only run once on mount

    // Handle markers and bounds
    useEffect(() => {
        if (!map) return; // Wait for map to initialize

        // Clear existing markers (optional)
        const markers = document.getElementsByClassName('mapboxgl-marker');
        while(markers.length > 0){
            markers[0].remove();
        }

        // Add user location marker if available
        if (userLocation) {
            new mapboxgl.Marker({
                color: "#FF0000" // Red color for user location
            })
            .setLngLat(userLocation)
            .addTo(map);

            // Center on user location if no pickup/dropoff
            if (!props.pickupCoordinates && !props.dropoffCoordinates) {
                map.flyTo({
                    center: userLocation,
                    zoom: 14
                });
            }
        }

        if (props.pickupCoordinates) {
            addToMap(map, props.pickupCoordinates);
        }

        if (props.dropoffCoordinates) {
            addToMap(map, props.dropoffCoordinates);
        }

        if (props.pickupCoordinates && props.dropoffCoordinates) {
            map.fitBounds([
                props.pickupCoordinates,
                props.dropoffCoordinates
            ], {
                padding: 60
            });
        }

    }, [map, userLocation, props.pickupCoordinates, props.dropoffCoordinates]);

    const addToMap = (map, coordinates) => {
        new mapboxgl.Marker({
            color: "#ffffff"
        })
        .setLngLat(coordinates)
        .addTo(map);
    };

    return (
        <Wrapper id='map'>
        </Wrapper>
    )
};

export default Map

const Wrapper = tw.div`
    flex-1 h-1/2
`