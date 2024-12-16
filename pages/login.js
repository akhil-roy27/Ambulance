import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '../firebase';
import tw from 'tailwind-styled-components';

// Styled components without dark mode
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

function Login() {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const backgroundImages = [
        "/images/1.jpg",
        "/images/3.jpg",
    ];

    useEffect(() => {
        // Auth state listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/');
            }
        });
        
        // Loading state
        setTimeout(() => setIsLoaded(true), 100);

        // Image rotation
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);

        // Cleanup
        return () => {
            clearInterval(interval);
            unsubscribe();
        };
    }, [router]);

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            // Router will handle redirect via onAuthStateChanged
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    if (!isLoaded) {
        return <div className="min-h-screen w-full bg-white"></div>;
    }

    return (
        <MainContainer>
            <TopSection>
                <BackgroundContainer>
                    {backgroundImages.map((image, i) => (
                        <BackgroundImage 
                            key={i}
                            style={{
                                opacity: currentImageIndex === i ? 1 : 0,
                                backgroundImage: `url(${image})`
                            }}
                        />
                    ))}
                </BackgroundContainer>
                <ContentOverlay>
                    <MainTitle>
                        AI to make your day a little less stressful
                    </MainTitle>
                    <SubTitle>
                        We are your digital housekeepers
                    </SubTitle>
                </ContentOverlay>
            </TopSection>
            <FormSection>
                <FormContainer>
                    <LoginTitle>
                        <img 
                            src="/icoon.png" 
                            alt="BioSync Logo" 
                            className="h-12 w-auto mx-auto"
                        />
                    </LoginTitle>
                    <SubLoginText>
                        You can login or sign up here with multiple different client options
                    </SubLoginText>
                    <ButtonsContainer>
                        <GoogleButton onClick={handleGoogleSignIn}>
                            <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                            Login with Google
                        </GoogleButton>
                        
                        <Divider>
                            <DividerText>Or continue with</DividerText>
                        </Divider>

                        <EmailForm>
                            <InputGroup>
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    type="email" 
                                    id="email" 
                                    placeholder="Enter your email"
                                />
                            </InputGroup>

                            <InputGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    type="password" 
                                    id="password" 
                                    placeholder="Enter your password"
                                />
                            </InputGroup>

                            <LoginButton type="submit">
                                Login
                            </LoginButton>
                        </EmailForm>

                        <SignupText>
                            Don't have an account?{" "}
                            <SignupLink onClick={() => router.push('/signup')}>
                                Sign up
                            </SignupLink>
                        </SignupText>
                    </ButtonsContainer>
                </FormContainer>
            </FormSection>
        </MainContainer>
    );
}

export default Login;