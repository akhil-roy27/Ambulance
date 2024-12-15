import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components'
import mapboxgl from '!mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2bGlucm9jaGEiLCJhIjoiY2t2bG82eTk4NXFrcDJvcXBsemZzdnJoYSJ9.aq3RAvhuRww7R_7q-giWpA';

export const Map = (props) => {
    const [userLocation, setUserLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [locationAccuracy, setLocationAccuracy] = useState(null);

    // Get user's current location with enhanced accuracy
    useEffect(() => {
        if ("geolocation" in navigator) {
            // First, try to get a quick initial position
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    updateLocation(position);
                },
                (error) => console.error("Initial position error:", error),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );

            // Then start watching position for better accuracy
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    updateLocation(position);
                },
                (error) => {
                    console.error("Watch position error:", {
                        code: error.code,
                        message: error.message
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );

            // Cleanup watch on component unmount
            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    const updateLocation = (position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        const accuracy = position.coords.accuracy;

        // Only update if accuracy is better than previous reading
        if (!locationAccuracy || accuracy < locationAccuracy) {
            setLocationAccuracy(accuracy);
            setUserLocation([longitude, latitude]);

            console.log('Updated Location Details:', {
                latitude,
                longitude,
                accuracy: accuracy.toFixed(2) + ' meters',
                speed: position.coords.speed ? position.coords.speed + ' m/s' : 'unavailable',
                altitude: position.coords.altitude ? position.coords.altitude + ' meters' : 'unavailable',
                heading: position.coords.heading ? position.coords.heading + '°' : 'unavailable',
                timestamp: new Date(position.timestamp).toLocaleString(),
            });
        }
    };

    // Initialize map
    useEffect(() => {
        const initializeMap = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: userLocation || [76.5222, 9.5916],
            zoom: 15,
        });

        setMap(initializeMap);

        // Add enhanced geolocate control
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 7000
            },
            trackUserLocation: true,
            showUserHeading: true,
            showAccuracyCircle: true
        });
        
        initializeMap.addControl(geolocate);

        // Trigger geolocate after map loads
        initializeMap.on('load', () => {
            geolocate.trigger();
        });

        return () => initializeMap.remove();
    }, []);

    // Handle markers and bounds
    useEffect(() => {
        if (!map || !userLocation) return;

        // Clear existing markers
        const markers = document.getElementsByClassName('mapboxgl-marker');
        while(markers.length > 0){
            markers[0].remove();
        }

        // Add user location marker with accuracy circle
        if (userLocation) {
            console.log('Setting marker for user location:', userLocation);
            new mapboxgl.Marker({
                color: "#FF0000",
                scale: 0.8
            })
            .setLngLat(userLocation)
            .addTo(map);

            if (!props.pickupCoordinates && !props.dropoffCoordinates) {
                map.flyTo({
                    center: userLocation,
                    zoom: 16,
                    essential: true
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
            {locationAccuracy && (
                <AccuracyIndicator>
                    Accuracy: {locationAccuracy.toFixed(2)}m
                </AccuracyIndicator>
            )}
        </Wrapper>
    )
};

export default Map

const Wrapper = tw.div`
    flex-1 h-1/2 relative
`

const AccuracyIndicator = tw.div`
    absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md z-10 text-sm
`