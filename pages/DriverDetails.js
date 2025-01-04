import { useState } from 'react';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';

const DriverDetails = () => {
    const router = useRouter();
    const [driverData, setDriverData] = useState({
        name: '',
        phone: '',
        aadhar: '',
        license: '',
        vehicle: '',
        vehicleRC: '',
        insurance: '',
        insuranceExpiry: '',
        puc: '',
        pucExpiry: '',
    });

    const [documents, setDocuments] = useState({
        photo: null,
        aadharDoc: null,
        licenseDoc: null,
        rcDoc: null,
        insuranceDoc: null,
        pucDoc: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDriverData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setDocuments(prev => ({
            ...prev,
            [name]: files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const driverEmail = localStorage.getItem('driverEmail');
            
            // Save form data
            localStorage.setItem(driverEmail, JSON.stringify(driverData));
            
            // Handle document uploads
            for (const [key, file] of Object.entries(documents)) {
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        localStorage.setItem(`${driverEmail}_${key}`, e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
            
            // After successful save, redirect to profile page
            router.push('/DriverProfile');
            
        } catch (error) {
            console.error('Error saving driver details:', error);
            alert('Failed to save details. Please try again.');
        }
    };

    return (
        <Wrapper>
            <FormContainer>
                <Title>Driver Details</Title>
                
                <Form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <SectionTitle>Personal Information</SectionTitle>
                    
                    <InputGroup>
                        <Label>Passport Size Photo</Label>
                        <FileInput
                            name="photo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>Full Name</Label>
                        <Input
                            name="name"
                            value={driverData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>Phone Number</Label>
                        <Input
                            name="phone"
                            value={driverData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter your phone number"
                        />
                    </InputGroup>

                    {/* Documents Section */}
                    <SectionTitle>Documents</SectionTitle>

                    <InputGroup>
                        <Label>Aadhar Number</Label>
                        <Input
                            name="aadhar"
                            value={driverData.aadhar}
                            onChange={handleChange}
                            required
                            placeholder="Enter Aadhar number"
                        />
                        <FileInput
                            name="aadharDoc"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>License Number</Label>
                        <Input
                            name="license"
                            value={driverData.license}
                            onChange={handleChange}
                            required
                            placeholder="Enter license number"
                        />
                        <FileInput
                            name="licenseDoc"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            required
                        />
                    </InputGroup>

                    {/* Vehicle Information */}
                    <SectionTitle>Vehicle Information</SectionTitle>

                    <InputGroup>
                        <Label>Vehicle Number</Label>
                        <Input
                            name="vehicle"
                            value={driverData.vehicle}
                            onChange={handleChange}
                            required
                            placeholder="Enter vehicle number"
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>RC Book Number</Label>
                        <Input
                            name="vehicleRC"
                            value={driverData.vehicleRC}
                            onChange={handleChange}
                            required
                            placeholder="Enter RC number"
                        />
                        <FileInput
                            name="rcDoc"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>Insurance Number</Label>
                        <Input
                            name="insurance"
                            value={driverData.insurance}
                            onChange={handleChange}
                            required
                            placeholder="Enter insurance number"
                        />
                        <Label>Insurance Expiry Date</Label>
                        <Input
                            name="insuranceExpiry"
                            type="date"
                            value={driverData.insuranceExpiry}
                            onChange={handleChange}
                            required
                        />
                        <FileInput
                            name="insuranceDoc"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>PUC Number</Label>
                        <Input
                            name="puc"
                            value={driverData.puc}
                            onChange={handleChange}
                            required
                            placeholder="Enter PUC number"
                        />
                        <Label>PUC Expiry Date</Label>
                        <Input
                            name="pucExpiry"
                            type="date"
                            value={driverData.pucExpiry}
                            onChange={handleChange}
                            required
                        />
                        <FileInput
                            name="pucDoc"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            required
                        />
                    </InputGroup>

                    <SubmitButton type="submit">
                        Submit Details
                    </SubmitButton>
                </Form>
            </FormContainer>
        </Wrapper>
    );
};

// Styled Components
const Wrapper = tw.div`
    min-h-screen bg-gray-100
    flex items-center justify-center
    py-12 px-4 sm:px-6 lg:px-8
`;

const FormContainer = tw.div`
    max-w-2xl w-full space-y-8
    bg-white p-8 rounded-lg shadow-lg
`;

const Title = tw.h2`
    text-3xl font-bold text-center
    text-gray-900 mb-8
`;

const SectionTitle = tw.h3`
    text-xl font-semibold text-gray-800
    mt-8 mb-4
`;

const Form = tw.form`
    space-y-6
`;

const InputGroup = tw.div`
    space-y-2
`;

const Label = tw.label`
    block text-sm font-medium text-gray-700
`;

const Input = tw.input`
    w-full px-3 py-2
    border border-gray-300 rounded-md
    focus:outline-none focus:ring-2 focus:ring-black
    focus:border-transparent
    transition duration-200
`;

const FileInput = tw.input`
    w-full
    file:mr-4 file:py-2 file:px-4
    file:rounded-md file:border-0
    file:text-sm file:font-medium
    file:bg-black file:text-white
    hover:file:bg-gray-800
`;

const SubmitButton = tw.button`
    w-full py-2 px-4
    bg-black text-white
    rounded-md hover:bg-gray-800
    transition duration-200
    font-medium
`;

export default DriverDetails; 