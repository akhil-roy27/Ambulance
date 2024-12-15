import { useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2bGlucm9jaGEiLCJhIjoiY2t2bG82eTk4NXFrcDJvcXBsemZzdnJoYSJ9.aq3RAvhuRww7R_7q-giWpA';

export const Map = ({ pickupCoordinates, dropoffCoordinates }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        // Initialize map with default center
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [76.9366, 8.5241], // Default center (can be anywhere)
            zoom: 11
        });

        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    
                    // Add user's location marker
                    new mapboxgl.Marker({
                        color: "#3b82f6",
                        scale: 0.8
                    })
                    .setLngLat([longitude, latitude])
                    .addTo(map);

                    // Add a pulsing dot for current location
                    const size = 200;
                    const pulsingDot = {
                        width: size,
                        height: size,
                        data: new Uint8Array(size * size * 4),
                        
                        onAdd: function() {
                            const canvas = document.createElement('canvas');
                            canvas.width = this.width;
                            canvas.height = this.height;
                            this.context = canvas.getContext('2d');
                        },
                        
                        render: function() {
                            const duration = 1000;
                            const t = (performance.now() % duration) / duration;
                            
                            const radius = (size / 2) * 0.3;
                            const outerRadius = (size / 2) * 0.7 * t + radius;
                            const context = this.context;
                            
                            context.clearRect(0, 0, this.width, this.height);
                            context.beginPath();
                            context.arc(
                                this.width / 2,
                                this.height / 2,
                                outerRadius,
                                0,
                                Math.PI * 2
                            );
                            context.fillStyle = `rgba(59, 130, 246, ${1 - t})`;
                            context.fill();
                            
                            context.beginPath();
                            context.arc(
                                this.width / 2,
                                this.height / 2,
                                radius,
                                0,
                                Math.PI * 2
                            );
                            context.fillStyle = 'rgba(59, 130, 246, 1)';
                            context.strokeStyle = 'white';
                            context.lineWidth = 2 + 4 * (1 - t);
                            context.fill();
                            context.stroke();
                            
                            this.data = context.getImageData(
                                0,
                                0,
                                this.width,
                                this.height
                            ).data;
                            
                            map.triggerRepaint();
                            return true;
                        }
                    };

                    // Wait for map to load before adding markers and route
                    map.on('load', () => {
                        // Add the pulsing dot source and layer
                        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
                        
                        map.addSource('dot-point', {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [
                                    {
                                        'type': 'Feature',
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': [longitude, latitude]
                                        }
                                    }
                                ]
                            }
                        });
                        
                        map.addLayer({
                            'id': 'layer-with-pulsing-dot',
                            'type': 'symbol',
                            'source': 'dot-point',
                            'layout': {
                                'icon-image': 'pulsing-dot'
                            }
                        });

                        // Fly to user's location
                        map.flyTo({
                            center: [longitude, latitude],
                            zoom: 14,
                            essential: true
                        });

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
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }

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