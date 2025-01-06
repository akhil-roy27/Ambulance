import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components'
import { carList } from '../../data/carList';

function RideSelector({pickupCoordinates, dropoffCoordinates, setSelectedType}) {
    const [rideDuration, setRideDuration] = useState(0);
    const [rideDistance, setRideDistance] = useState(0);
    const [selectedCar, setSelectedCar] = useState('');

    useEffect(() => {
        // Check if coordinates are available
        if (pickupCoordinates && dropoffCoordinates) {
            // Create the coordinates string
            const pickupCoords = `${pickupCoordinates[0]},${pickupCoordinates[1]}`;
            const dropoffCoords = `${dropoffCoordinates[0]},${dropoffCoordinates[1]}`;
            
            fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords};${dropoffCoords}?geometries=geojson&access_token=pk.eyJ1IjoiZGV2bGlucm9jaGEiLCJhIjoiY2t2bG82eTk4NXFrcDJvcXBsemZzdnJoYSJ9.aq3RAvhuRww7R_7q-giWpA`)
                .then(res => res.json())
                .then(data => {
                    if (data.routes && data.routes[0]) {
                        setRideDuration(data.routes[0].duration / 60); // Convert to minutes
                        setRideDistance(data.routes[0].distance / 1000); // Convert to kilometers
                    }
                })
                .catch(err => {
                    console.error("Error fetching route:", err);
                });
        }
    }, [pickupCoordinates, dropoffCoordinates]);

    const handleCarSelect = (car) => {
        // Store the selected car type and pass it up to parent
        setSelectedCar(car.service);
        setSelectedType(car.service); // This will update the text in confirm.js
    };

    return (
        <Wrapper>
            <Title>Choose a ride, or swipe up for more</Title>
            
            <TripInfo>
                <TripDetail>
                    <Label>Distance:</Label>
                    <Value>{rideDistance.toFixed(1)} km</Value>
                </TripDetail>
                <TripDetail>
                    <Label>Duration:</Label>
                    <Value>{rideDuration.toFixed(0)} mins</Value>
                </TripDetail>
            </TripInfo>

            <CarList>
                {carList.map((car, index) => (
                    <Car 
                        key={index}
                        onClick={() => handleCarSelect(car)}
                        className={selectedCar === car.service ? 'selected' : ''}
                    >
                        <CarImage src={car.imgUrl} />
                        <CarDetails>
                            <Service>{car.service}</Service>
                            <Time>5 min away</Time>
                        </CarDetails>
                        <PriceGroup>
                            <Price>₹{(((rideDistance * car.multiplier) + 5) * 83).toFixed(0)}</Price>
                            <PriceDetails>Base + distance</PriceDetails>
                        </PriceGroup>
                    </Car>
                ))}
            </CarList>
        </Wrapper>
    )
};

export default RideSelector;

const Wrapper = tw.div`
    flex-1 overflow-y-scroll flex flex-col bg-white rounded-t-lg
`

const Title = tw.div`
    text-gray-500 text-center text-sm py-3 border-b
`

const TripInfo = tw.div`
    flex justify-around py-4 border-b border-gray-100 bg-gray-50
`

const TripDetail = tw.div`
    flex flex-col items-center
`

const Label = tw.span`
    text-sm text-gray-500
`

const Value = tw.span`
    text-lg font-medium
`

const CarList = tw.div`
    overflow-y-scroll flex-1
`

const Car = tw.div`
    flex p-4 items-center border-b border-gray-100 
    hover:bg-gray-50 cursor-pointer
    transition duration-200
    ${(p) => p.className === 'selected' ? 'bg-blue-50 border-blue-200' : ''}
`

const CarImage = tw.img`
    h-14 mr-4
`

const CarDetails = tw.div`
    flex-1
`

const Service = tw.div`
    font-medium
`

const Time = tw.div`
    text-xs text-blue-500
`

const PriceGroup = tw.div`
    flex flex-col items-end
`

const Price = tw.div`
    text-lg font-medium font-mono
`

const PriceDetails = tw.div`
    text-xs text-gray-500
`