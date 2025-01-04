import React, { useState } from 'react';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';

const DriverRequests = () => {
    const router = useRouter();
    const [requests, setRequests] = useState([
        {
            id: '1',
            customerName: 'John Doe',
            pickup: '123 Main St',
            dropoff: '456 Oak Ave',
            distance: '5.2 km',
            timestamp: new Date().toISOString(),
            status: 'pending'
        }
    ]);

    const handleAccept = (requestId) => {
        setRequests(prev => 
            prev.map(req => 
                req.id === requestId 
                    ? {...req, status: 'accepted'} 
                    : req
            )
        );
    };

    const handleReject = (requestId) => {
        setRequests(prev => 
            prev.map(req => 
                req.id === requestId 
                    ? {...req, status: 'rejected'} 
                    : req
            )
        );
    };

    return (
        <>
            <BackgroundImage 
                style={{
                    backgroundImage: "url('/ambulance-bg.png')"
                }}
            />
            <Wrapper>
                <Container>
                    <Header>
                        <BackButton onClick={() => router.push('/DriverProfile')}>
                            ← Back to Profile
                        </BackButton>
                        <Title>Ride Requests</Title>
                    </Header>

                    <RequestsContainer>
                        {requests.map((request) => (
                            <RequestCard key={request.id}>
                                <RequestHeader>
                                    <CustomerName>{request.customerName}</CustomerName>
                                    <TimeStamp>
                                        {new Date(request.timestamp).toLocaleTimeString()}
                                    </TimeStamp>
                                </RequestHeader>

                                <LocationInfo>
                                    <LocationItem>
                                        <LocationDot className="bg-green-500" />
                                        <LocationText>{request.pickup}</LocationText>
                                    </LocationItem>
                                    <LocationLine />
                                    <LocationItem>
                                        <LocationDot className="bg-red-500" />
                                        <LocationText>{request.dropoff}</LocationText>
                                    </LocationItem>
                                </LocationInfo>

                                <TripInfo>
                                    <TripDetail>
                                        <Label>Distance</Label>
                                        <Value>{request.distance}</Value>
                                    </TripDetail>
                                </TripInfo>

                                {request.status === 'pending' && (
                                    <ActionButtons>
                                        <AcceptButton onClick={() => handleAccept(request.id)}>
                                            Accept
                                        </AcceptButton>
                                        <RejectButton onClick={() => handleReject(request.id)}>
                                            Reject
                                        </RejectButton>
                                    </ActionButtons>
                                )}

                                {request.status === 'accepted' && (
                                    <StatusBadge className="bg-green-100 text-green-800">
                                        Accepted
                                    </StatusBadge>
                                )}

                                {request.status === 'rejected' && (
                                    <StatusBadge className="bg-red-100 text-red-800">
                                        Rejected
                                    </StatusBadge>
                                )}
                            </RequestCard>
                        ))}
                    </RequestsContainer>
                </Container>
            </Wrapper>
        </>
    );
};

// Styled Components
const Wrapper = tw.div`
    min-h-screen
    p-4 md:p-8
    bg-gradient-to-b from-white to-blue-50
    bg-opacity-95
    relative
`;

const BackgroundImage = tw.div`
    fixed top-0 left-0 right-0 bottom-0
    -z-10
    bg-cover bg-center bg-no-repeat
    opacity-15
`;

const Container = tw.div`
    max-w-2xl mx-auto
    space-y-6
    relative
    z-10
`;

const Header = tw.div`
    flex items-center justify-between
    mb-6
`;

const BackButton = tw.button`
    text-gray-600 hover:text-gray-900
    transition duration-200
`;

const Title = tw.h1`
    text-2xl font-bold text-gray-900
`;

const RequestsContainer = tw.div`
    space-y-4
`;

const RequestCard = tw.div`
    bg-white rounded-lg shadow-md
    p-4 space-y-4
`;

const RequestHeader = tw.div`
    flex justify-between items-center
`;

const CustomerName = tw.h3`
    font-semibold text-lg
`;

const TimeStamp = tw.span`
    text-sm text-gray-500
`;

const LocationInfo = tw.div`
    space-y-2 my-4
    relative
`;

const LocationItem = tw.div`
    flex items-center space-x-2
`;

const LocationDot = tw.div`
    w-3 h-3 rounded-full
`;

const LocationLine = tw.div`
    absolute left-1.5 top-3 w-0.5 h-8
    bg-gray-300
`;

const LocationText = tw.span`
    text-gray-600
`;

const TripInfo = tw.div`
    flex justify-between
    border-t border-b border-gray-200
    py-2 my-2
`;

const TripDetail = tw.div`
    text-center
`;

const Label = tw.div`
    text-xs text-gray-500
`;

const Value = tw.div`
    font-semibold
`;

const ActionButtons = tw.div`
    flex space-x-4
`;

const AcceptButton = tw.button`
    flex-1 py-2 px-4
    bg-green-600 text-white
    rounded-md hover:bg-green-700
    transition duration-200
`;

const RejectButton = tw.button`
    flex-1 py-2 px-4
    bg-red-600 text-white
    rounded-md hover:bg-red-700
    transition duration-200
`;

const StatusBadge = tw.div`
    text-center py-2 rounded-md
    font-medium
`;

export default DriverRequests; 