import { useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2bGlucm9jaGEiLCJhIjoiY2t2bG82eTk4NXFrcDJvcXBsemZzdnJoYSJ9.aq3RAvhuRww7R_7q-giWpA';

export const Map = ({ pickupCoordinates, dropoffCoordinates }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-99.29011, 39.39172],
            zoom: 3
        });

        // Wait for map to load before adding markers and route
        map.on('load', () => {
            if (pickupCoordinates) {
                addToMap(map, pickupCoordinates, 'pickup');
            }

            if (dropoffCoordinates) {
                addToMap(map, dropoffCoordinates, 'dropoff');
            }

            if (pickupCoordinates && dropoffCoordinates) {
                map.fitBounds([
                    pickupCoordinates,
                    dropoffCoordinates
                ], {
                    padding: 60
                });

                getRoute(map, pickupCoordinates, dropoffCoordinates);
            }
        });

        // Cleanup function
        return () => map.remove();

    }, [pickupCoordinates, dropoffCoordinates]);

    const addToMap = (map, coordinates, type) => {
        const marker = new mapboxgl.Marker({
            color: type === 'pickup' ? '#00ff00' : '#ff0000'
        })
            .setLngLat(coordinates)
            .addTo(map);
    }

    const getRoute = async (map, start, end) => {
        try {
            const query = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
                { method: 'GET' }
            );
            const json = await query.json();
            const data = json.routes[0];
            const route = data.geometry.coordinates;

            // Check if the route layer/source already exists
            if (map.getSource('route')) {
                map.removeLayer('route');
                map.removeSource('route');
            }

            map.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': route
                    }
                }
            });

            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#3b82f6',
                    'line-width': 4,
                    'line-opacity': 0.75
                }
            });
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    }

    return (
        <Wrapper id='map' ref={mapRef} />
    )
}

export default Map

const Wrapper = tw.div`
    flex-1 h-1/2
`