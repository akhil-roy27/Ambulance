import { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import tw from 'tailwind-styled-components'
import Map from './components/Map';
import Link from 'next/link';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      if (user) {
        setUser({
          name: user.displayName,
          photoUrl: user.photoURL,
        });
      } else {
        setUser(null);
        router.push('/login');
      }
    })
  }, []);

  return (
    <Container>
      <Map />
      <ActionItemsContainer>
        <ActionItems>
          <Header>
            <UberLogo src='https://i.ibb.co/ZMhy8ws/uber-logo.png' />
            <Profile>
              <Name>{user && user.name}</Name>
              <UserImage
                src={user && user.photoUrl}
                onClick={() => signOut(auth)}
              />
            </Profile>
          </Header>
          
          <ActionButtons>
            <Link href='/search'>
              <ActionButton>
                <ActionButtonImage src='/ambulance.png' />
                <ActionButtonText>Ambulance</ActionButtonText>
              </ActionButton>
            </Link>

            <ActionButton>
              <ActionButtonImage src='/clinic.png' />
              <ActionButtonText>Clinics</ActionButtonText>
            </ActionButton>

            
          </ActionButtons>

          <InputButton>
            <InputButtonText>Where to?</InputButtonText>
          </InputButton>
        </ActionItems>
      </ActionItemsContainer>
    </Container>
  )
};

const Container = tw.div`
  flex flex-col h-screen relative
`

const ActionItemsContainer = tw.div`
  absolute bottom-3 left-3 right-3 bg-white rounded-t-3xl shadow-xl z-10
`

const ActionItems = tw.div`
  px-6 py-4
`

const Header = tw.div`
  flex justify-between items-center mb-4
`

const UberLogo = tw.img`
  h-20
`

const Profile = tw.div`
  flex items-center bg-gray-50 px-4 py-2 rounded-full
`

const Name = tw.div`
  mr-4 w-20 text-sm font-medium
`

const UserImage = tw.img`
  h-12 w-12 rounded-full border border-gray-200 p-px object-cover cursor-pointer hover:border-gray-400 transition
`

const ActionButtons = tw.div`
  flex gap-3 mb-4
`

const ActionButton = tw.div`
  flex flex-col flex-1 bg-gray-50 py-4 items-center justify-center rounded-xl
  transform hover:scale-105 transition duration-300 ease-in-out
  cursor-pointer hover:bg-gray-100
`

const ActionButtonImage = tw.img`
  h-3/5 mb-3
`

const ActionButtonText = tw.span`
  font-medium text-lg
`

const InputButton = tw.div`
  h-16 bg-gray-50 rounded-full px-6 flex items-center cursor-pointer
  hover:bg-gray-100 transition duration-300 ease-in-out
`

const InputButtonText = tw.span`
  text-lg text-gray-600 font-medium
`