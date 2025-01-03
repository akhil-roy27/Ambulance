import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '../firebase';
import tw from 'tailwind-styled-components';

// Add these styled component definitions
const MainContainer = tw.div`
    min-h-screen w-full
    flex flex-col md:flex-row
    bg-white
`;

const TopSection = tw.div`
    relative w-full 
    h-[50vh] md:h-screen md:w-1/2
`;

const BackgroundContainer = tw.div`
    absolute inset-0
`;

const BackgroundImage = tw.div`
    absolute inset-0 transition-all duration-1000
    bg-cover bg-center
`;

const ContentOverlay = tw.div`
    relative z-10 flex flex-col justify-center items-center h-full p-8
    bg-gradient-to-b from-transparent to-black/60
    md:bg-gradient-to-r md:from-transparent md:to-black/60
`;

const FormSection = tw.div`
    flex-1 w-full
    flex items-center justify-center
    md:w-1/2
    bg-white text-gray-900
`;

const MainTitle = tw.h1`
    text-4xl lg:text-5xl text-white font-bold text-center mb-4
`;

const SubTitle = tw.p`
    text-xl text-custom-cyan text-center
`;

const FormContainer = tw.div`
    w-full max-w-md space-y-6
    px-6
`;

const LoginTitle = tw.h2`
    text-2xl font-semibold text-center
    text-gray-900
`;

const SubLoginText = tw.p`
    text-sm text-center text-gray-600 mt-2
`;

const ButtonsContainer = tw.div`
    space-y-4 mt-6
`;

const GoogleButton = tw.button`
    w-full flex items-center justify-center gap-3
    bg-white hover:bg-gray-50 text-gray-700
    p-3 rounded-lg transition-all duration-300
    shadow-sm
`;

const Divider = tw.div`
    relative py-4
    flex items-center justify-center
`;

const DividerText = tw.span`
    px-2 bg-white
    text-gray-500 text-sm
`;

const EmailForm = tw.form`
    space-y-4
`;

const InputGroup = tw.div`
    space-y-1
`;

const Label = tw.label`
    block text-sm font-medium
    text-gray-700
`;

const Input = tw.input`
    w-full px-3 py-2
    bg-white border-gray-300 text-gray-900
    border rounded-lg
    shadow-sm focus:outline-none focus:ring-2
    focus:ring-gray-400 focus:border-transparent
    transition-all duration-200
`;

const LoginButton = tw.button`
    w-full py-2 px-4 rounded-lg
    text-white bg-black hover:bg-gray-800
    transition-colors duration-300
`;

const SignupText = tw.p`
    text-sm text-center
    text-gray-600
`;

const SignupLink = tw.button`
    text-black
    hover:underline font-medium
`;

const DriverLogin = () => {
    const router = useRouter();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Store user data
            localStorage.setItem('userName', user.displayName);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userPhoto', user.photoURL);
            localStorage.setItem('userId', user.uid);
            
            // Redirect to home page after successful login
            router.push('/');
        } catch (error) {
            console.error('Error details:', error); // Add detailed error logging
            alert('Failed to sign in with Google. Please try again.');
        }
    };

    return (
        <MainContainer>
            <TopSection>
                <BackgroundContainer>
                    <BackgroundImage style={{ backgroundImage: "url('/path-to-your-background-image.jpg')" }} />
                </BackgroundContainer>
                <ContentOverlay>
                    <MainTitle>Driver Login</MainTitle>
                    <SubTitle>Welcome back!</SubTitle>
                </ContentOverlay>
            </TopSection>

            <FormSection>
                <FormContainer>
                    <LoginTitle>Sign in to your account</LoginTitle>
                    <SubLoginText>Enter your credentials to continue</SubLoginText>

                    <EmailForm>
                        <InputGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                required
                            />
                        </InputGroup>

                        <LoginButton type="submit">Login</LoginButton>
                    </EmailForm>

                    <Divider>
                        <DividerText>Or continue with</DividerText>
                    </Divider>

                    <ButtonsContainer>
                        <GoogleButton onClick={signInWithGoogle}>
                            <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
                            Sign in with Google
                        </GoogleButton>
                    </ButtonsContainer>

                    <SignupText>
                        Don't have an account?{' '}
                        <SignupLink>Sign up</SignupLink>
                    </SignupText>
                </FormContainer>
            </FormSection>
        </MainContainer>
    );
};

// Make sure to export the component as default
export default DriverLogin; 