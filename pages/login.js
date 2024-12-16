import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '../firebase';
import tw from 'tailwind-styled-components';

// First, define all styled components
const MainContainer = tw.div`
    min-h-screen w-full
    flex flex-col md:flex-row
    ${p => p.$isDark ? 'bg-black' : 'bg-white'}
`;

const TopSection = tw.div`
    relative w-full 
    h-[45vh] md:h-screen md:w-1/2
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
    flex-1 w-full px-6 py-8
    md:w-1/2 md:flex md:items-center md:justify-center
    ${p => p.$isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}
`;

const LeftSection = tw.div`
    relative w-full lg:w-1/2 h-screen
`;

const MainTitle = tw.h1`
    text-4xl lg:text-5xl text-white font-bold text-center mb-4
`;

const SubTitle = tw.p`
    text-xl text-custom-cyan text-center
`;

const RightSection = tw.div`
    absolute top-0 right-0 w-full lg:w-1/2 h-screen
    bg-white dark:bg-[#0E0E0C]
    flex items-center justify-center p-8
`;

const FormContainer = tw.div`
    w-full max-w-md space-y-6
`;

const LoginTitle = tw.h2`
    text-2xl font-semibold text-center
    text-gray-900 dark:text-white
`;

const SubLoginText = tw.p`
    text-sm text-center text-gray-600 dark:text-gray-400 mt-2
`;

const ButtonsContainer = tw.div`
    space-y-4 mt-6
`;

const GoogleButton = tw.button`
    w-full flex items-center justify-center gap-3
    bg-white hover:bg-gray-50 text-gray-700
    p-3 rounded-lg transition-all duration-300
    shadow-sm dark:bg-[#0E0E0C] dark:border
    dark:border-gray-600 dark:hover:bg-gray-700
    dark:text-white
`;

const Divider = tw.div`
    relative py-4
    flex items-center justify-center
`;

const DividerText = tw.span`
    px-2 bg-white dark:bg-[#0E0E0C]
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
    text-gray-700 dark:text-gray-300
`;

const Input = tw.input`
    w-full px-3 py-2 bg-white
    border border-gray-300 rounded-lg
    shadow-sm focus:outline-none focus:ring-2
    focus:ring-gray-400 focus:border-transparent
    transition-all duration-200
    dark:bg-[#0E0E0C] dark:border-gray-600
    dark:text-white dark:focus:ring-gray-500
`;

const LoginButton = tw.button`
    w-full py-2 px-4 rounded-lg
    text-white bg-black hover:bg-gray-800
    transition-colors duration-300
    dark:bg-white dark:text-black
    dark:hover:bg-gray-200
`;

const SignupText = tw.p`
    text-sm text-center
    text-gray-600 dark:text-gray-400
`;

const SignupLink = tw.button`
    text-black dark:text-white
    hover:underline font-medium
`;

const ThemeToggle = tw.button`
    absolute top-4 right-4 z-50
    p-2 rounded-lg bg-gray-100
    dark:bg-[#0E0E0C] dark:border
    dark:border-gray-900 text-gray-900
    dark:text-white shadow-lg
`;

function Login() {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDark, setIsDark] = useState(true);

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

        // Theme initialization
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(savedTheme === "dark" || (!savedTheme && prefersDark));
        
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

    const toggleTheme = () => {
        setIsDark(!isDark);
        localStorage.setItem("theme", !isDark ? "dark" : "light");
    };

    if (!isLoaded) {
        return <div className="min-h-screen w-full bg-black"></div>;
    }

    return (
        <MainContainer $isDark={isDark}>
            <ThemeToggle onClick={toggleTheme} $isDark={isDark}>
                {isDark ? (
                    <img src="moon.svg" alt="Dark mode" className="w-5 h-5" />
                ) : (
                    <img src="/sun.svg" alt="Light mode" className="w-5 h-5" />
                )}
            </ThemeToggle>
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
            <FormSection $isDark={isDark}>
                <FormContainer>
                    <LoginTitle>
                        Login to BioSync
                    </LoginTitle>
                    <SubLoginText>
                        You can login or sign up here with multiple different client options
                    </SubLoginText>
                    <ButtonsContainer>
                        <GoogleButton onClick={handleGoogleSignIn}>
                            <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2 dark:invert" />
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