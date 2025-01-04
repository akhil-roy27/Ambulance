import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';

const DriverProfile = () => {
    const router = useRouter();
    const [driverData, setDriverData] = useState(null);
    const [availability, setAvailability] = useState({
        status: 'offline', // offline, online, busy
        startTime: '',
        endTime: ''
    });

    useEffect(() => {
        // Get driver email and details
        const driverEmail = localStorage.getItem('driverEmail');
        const details = localStorage.getItem(driverEmail);
        const savedAvailability = localStorage.getItem(`${driverEmail}_availability`);
        
        if (details) {
            setDriverData(JSON.parse(details));
        }
        if (savedAvailability) {
            setAvailability(JSON.parse(savedAvailability));
        }
    }, []);

    const handleAvailabilityChange = (e) => {
        setAvailability(prev => ({
            ...prev,
            status: e.target.value
        }));
    };

    const handleTimeChange = (e) => {
        setAvailability(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const saveAvailability = () => {
        const driverEmail = localStorage.getItem('driverEmail');
        localStorage.setItem(`${driverEmail}_availability`, JSON.stringify(availability));
        alert('Availability updated successfully!');
    };

    if (!driverData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <BackgroundImage 
                style={{
                    backgroundImage: "url('/hospital-bg.png')"  // Add your image path here
                }}
            />
            <Wrapper>
                <ProfileContainer>
                    <Title>Driver Profile</Title>
                    
                    <ViewRequestsButton onClick={() => router.push('/DriverRequests')}>
                        View Ride Requests
                        <span className="animate-pulse bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                            New
                        </span>
                    </ViewRequestsButton>

                    <ProfileImage 
                        src={localStorage.getItem('driverPhoto') || '/default-avatar.png'} 
                        alt="Profile"
                    />

                    {/* Availability Section */}
                    <InfoSection>
                        <InfoTitle>Set Availability</InfoTitle>
                        <AvailabilityContainer>
                            <StatusGroup>
                                <Label>Status:</Label>
                                <Select 
                                    value={availability.status}
                                    onChange={handleAvailabilityChange}
                                >
                                    <option value="offline">Offline</option>
                                    <option value="online">Online</option>
                                    <option value="busy">Busy</option>
                                </Select>
                            </StatusGroup>

                            <TimeGroup>
                                <div>
                                    <Label>Start Time:</Label>
                                    <TimeInput
                                        type="time"
                                        name="startTime"
                                        value={availability.startTime}
                                        onChange={handleTimeChange}
                                    />
                                </div>
                                <div>
                                    <Label>End Time:</Label>
                                    <TimeInput
                                        type="time"
                                        name="endTime"
                                        value={availability.endTime}
                                        onChange={handleTimeChange}
                                    />
                                </div>
                            </TimeGroup>

                            <SaveButton onClick={saveAvailability}>
                                Save Availability
                            </SaveButton>
                        </AvailabilityContainer>
                    </InfoSection>

                    {/* Personal Information */}
                    <InfoSection>
                        <InfoTitle>Personal Information</InfoTitle>
                        <InfoGrid>
                            <InfoItem>
                                <Label>Name:</Label>
                                <Value>{driverData.name}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>Phone:</Label>
                                <Value>{driverData.phone}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>Email:</Label>
                                <Value>{localStorage.getItem('driverEmail')}</Value>
                            </InfoItem>
                        </InfoGrid>
                    </InfoSection>

                    {/* Vehicle Information */}
                    <InfoSection>
                        <InfoTitle>Vehicle Information</InfoTitle>
                        <InfoGrid>
                            <InfoItem>
                                <Label>Vehicle Number:</Label>
                                <Value>{driverData.vehicle}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>RC Number:</Label>
                                <Value>{driverData.vehicleRC}</Value>
                            </InfoItem>
                        </InfoGrid>
                    </InfoSection>

                    {/* Documents */}
                    <InfoSection>
                        <InfoTitle>Documents</InfoTitle>
                        <InfoGrid>
                            <InfoItem>
                                <Label>Aadhar:</Label>
                                <Value>{driverData.aadhar}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>License:</Label>
                                <Value>{driverData.license}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>Insurance:</Label>
                                <Value>{driverData.insurance}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>PUC:</Label>
                                <Value>{driverData.puc}</Value>
                            </InfoItem>
                        </InfoGrid>
                    </InfoSection>

                    <Button onClick={() => router.push('/')}>
                        Back to Home
                    </Button>
                </ProfileContainer>
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

const ProfileContainer = tw.div`
    max-w-2xl mx-auto
    space-y-6
    bg-white/90
    p-8 rounded-lg shadow-lg
    backdrop-blur-sm
    relative
    z-10
`;

const Title = tw.h1`
    text-3xl font-bold text-center text-gray-900
`;

const ProfileImage = tw.img`
    w-32 h-32 rounded-full mx-auto
    border-4 border-gray-200
    object-cover
`;

const InfoSection = tw.div`
    mt-8
`;

const InfoTitle = tw.h2`
    text-xl font-semibold text-gray-800 mb-4
`;

const InfoGrid = tw.div`
    grid grid-cols-1 md:grid-cols-2 gap-4
`;

const InfoItem = tw.div`
    border-b border-gray-200 pb-2
`;

const Label = tw.span`
    text-sm font-medium text-gray-500
`;

const Value = tw.span`
    ml-2 text-gray-900
`;

const AvailabilityContainer = tw.div`
    space-y-6
`;

const StatusGroup = tw.div`
    flex items-center space-x-4
`;

const TimeGroup = tw.div`
    grid grid-cols-2 gap-4
`;

const Select = tw.select`
    px-3 py-2 rounded-md border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-black
`;

const TimeInput = tw.input`
    px-3 py-2 rounded-md border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-black
`;

const SaveButton = tw.button`
    w-full py-2 px-4
    bg-green-600 text-white
    rounded-md hover:bg-green-700
    transition duration-200
    font-medium
`;

const Button = tw.button`
    w-full mt-6 py-2 px-4
    bg-black text-white
    rounded-md hover:bg-gray-800
    transition duration-200
    font-medium
`;

const RequestButton = tw.button`
    w-full py-3 px-4
    bg-blue-600 text-white
    rounded-md hover:bg-blue-700
    transition duration-200
    font-medium
    flex items-center justify-center
`;

const ViewRequestsButton = tw.button`
    w-full py-3 px-4 mb-4
    bg-blue-600 text-white
    rounded-md hover:bg-blue-700
    transition duration-200
    font-medium
    flex items-center justify-center
    shadow-md
`;

export default DriverProfile; 