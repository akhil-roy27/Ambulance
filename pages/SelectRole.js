import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';
import Image from 'next/image';

const SelectRole = () => {
    const router = useRouter();

    const handleRoleSelect = (role) => {
        localStorage.setItem('userRole', role);
        if (role === 'driver') {
            router.push('/DriverLogin');
        }
    };

    return (
        <Wrapper>
            <BackgroundImage>
                <Image
                    src="/ambulance.jpg"
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                />
            </BackgroundImage>

            <Title>Choose your role</Title>

            <CardContainer>
                <RoleCard onClick={() => handleRoleSelect('user')}>
                    <Image
                        src="/user.png"
                        width={80}
                        height={80}
                        alt="User"
                    />
                    <RoleTitle>Patient</RoleTitle>
                    <RoleDescription>Book an ambulance</RoleDescription>
                </RoleCard>

                <RoleCard onClick={() => handleRoleSelect('driver')}>
                    <Image
                        src="/driver.png"
                        width={80}
                        height={80}
                        alt="Driver"
                    />
                    <RoleTitle>Driver</RoleTitle>
                    <RoleDescription>Drive an ambulance</RoleDescription>
                </RoleCard>
            </CardContainer>
        </Wrapper>
    );
};

const Wrapper = tw.div`
    flex flex-col h-screen bg-gray-200
`;

const BackgroundImage = tw.div`
    absolute w-full h-full
`;

const Title = tw.h1`
    text-4xl pt-4 text-gray-500 z-10 text-center
`;

const CardContainer = tw.div`
    flex flex-col md:flex-row items-center justify-center flex-1 z-10 px-4 gap-6
`;

const RoleCard = tw.div`
    bg-white p-8 rounded-lg shadow-xl
    flex flex-col items-center
    transform transition-all duration-300
    hover:scale-105 cursor-pointer
    w-full max-w-sm
`;

const RoleTitle = tw.h2`
    text-2xl font-bold mt-4 text-gray-800
`;

const RoleDescription = tw.p`
    text-gray-600 mt-2
`;

export default SelectRole; 