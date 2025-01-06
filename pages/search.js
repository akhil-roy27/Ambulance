import { useState, useEffect } from 'react';
import tw from 'tailwind-styled-components'
import Link from 'next/link';
import AutocompleteInput from './components/AutocompleteInput';

function Search() {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [pickupCoordinates, setPickupCoordinates] = useState(null);
    const [dropoffCoordinates, setDropoffCoordinates] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
    }, []);

    const saveSearch = () => {
        if (pickup && dropoff) {
            const newSearch = {
                pickup,
                dropoff,
                timestamp: new Date().toISOString()
            };

            // Check if this search already exists
            const searchExists = recentSearches.some(
                search => 
                    search.pickup.toLowerCase() === pickup.toLowerCase() && 
                    search.dropoff.toLowerCase() === dropoff.toLowerCase()
            );

            if (!searchExists) {
                // Only add if it's a new unique search
                const updatedSearches = [newSearch, ...recentSearches.slice(0, 4)];
                setRecentSearches(updatedSearches);
                localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
            }
        }
    };

    const handleRecentSearchClick = (search) => {
        setPickup(search.pickup);
        setDropoff(search.dropoff);
    };

    const handlePickupSelect = (suggestion) => {
        setPickupCoordinates(suggestion.center);
    };

    const handleDropoffSelect = (suggestion) => {
        setDropoffCoordinates(suggestion.center);
    };

    const handleDeleteSearch = (searchToDelete) => {
        const updatedSearches = recentSearches.filter(
            search => 
                search.pickup !== searchToDelete.pickup || 
                search.dropoff !== searchToDelete.dropoff
        );
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    return (
        <Wrapper style={{}}>
            {/* Header */}
            <HeaderContainer>
                <Link href='/' >
                    <BackButton src='https://img.icons8.com/ios-filled/50/000000/left.png' />
                </Link>
                <HeaderText>Plan your ride</HeaderText>
            </HeaderContainer>

            {/* Main Input Section */}
            <InputContainer>
                <FromToIcons>
                    <Circle src='https://img.icons8.com/ios-filled/50/9CA3AF/filled-circle.png' />
                    <Line src='https://img.icons8.com/ios/50/9CA3AF/vertical-line.png' />
                    <Square src='https://img.icons8.com/windows/50/000000/square-full.png' />
                </FromToIcons>

                <InputBoxes>
                    <AutocompleteInput
                        placeholder='Enter pickup location'
                        value={pickup}
                        onChange={setPickup}
                        onSelect={handlePickupSelect}
                    />
                    <AutocompleteInput
                        placeholder='Where to?'
                        value={dropoff}
                        onChange={setDropoff}
                        onSelect={handleDropoffSelect}
                    />
                </InputBoxes>

                <PlusIcon src='https://img.icons8.com/ios/50/000000/plus-math.png' />
            </InputContainer>

            {/* Saved Places */}
            <SavedPlaces>
                <StarIcon src='https://img.icons8.com/ios-filled/50/ffffff/star--v1.png' />
                <SavedPlacesText>Saved Places</SavedPlacesText>
            </SavedPlaces>

            {/* Confirm Button */}
            <Link href={{
                pathname: '/confirm',
                query: {
                    pickup: pickup,
                    dropoff: dropoff,
                    pickupCoordinates: JSON.stringify(pickupCoordinates),
                    dropoffCoordinates: JSON.stringify(dropoffCoordinates),
                }
            }}>
                <ConfirmButtonContainer onClick={saveSearch}>
                    Confirm Locations
                </ConfirmButtonContainer>
            </Link>

            {/* Recent Searches Section */}
            {recentSearches.length > 0 && (
                <RecentSearchesContainer>
                    <RecentSearchesTitle>Recent Searches</RecentSearchesTitle>
                    {recentSearches.map((search, index) => (
                        <RecentSearchItem 
                            key={`${search.pickup}-${search.dropoff}-${index}`}
                        >
                            <div 
                                className="flex-1 flex items-center" 
                                onClick={() => handleRecentSearchClick(search)}
                            >
                                <RecentSearchIcon src='https://img.icons8.com/ios/50/000000/clock--v1.png' />
                                <RecentSearchDetails>
                                    <FromTo>From: {search.pickup}</FromTo>
                                    <FromTo>To: {search.dropoff}</FromTo>
                                    <SearchTime>
                                        {new Date(search.timestamp).toLocaleDateString()}
                                    </SearchTime>
                                </RecentSearchDetails>
                            </div>
                            <DeleteButton 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSearch(search);
                                }}
                            >
                                ×
                            </DeleteButton>
                        </RecentSearchItem>
                    ))}
                </RecentSearchesContainer>
            )}
        </Wrapper>
    )
};

export default Search;

const Wrapper = tw.div`
    flex flex-col h-screen bg-gray-50
`

const HeaderContainer = tw.div`
    flex items-center px-4 py-3 bg-white shadow-sm
`

const HeaderText = tw.div`
    text-xl font-semibold flex-1 text-center
`

const BackButton = tw.img`
    h-10 cursor-pointer hover:opacity-70 transition
`

const InputContainer = tw.div`
    bg-white flex items-center px-5 py-3 mb-2 mt-2 mx-4 shadow-sm rounded-lg
`

const FromToIcons = tw.div`
    w-10 flex flex-col mr-3 items-center
`

const Circle = tw.img`
    h-2.5
`

const Line = tw.img`
    h-10
`

const Square = tw.img`
    h-3
`

const InputBoxes = tw.div`
    flex flex-col flex-1 space-y-2
`

const Input = tw.input`
    h-12 bg-gray-50 rounded-lg p-3 outline-none border border-gray-100 
    focus:border-gray-300 transition duration-200 text-sm
`

const PlusIcon = tw.img`
    w-10 h-10 bg-gray-100 rounded-full ml-3 p-2 cursor-pointer
    hover:bg-gray-200 transition duration-200
`

const SavedPlaces = tw.div`
    flex items-center px-4 py-3 bg-white mx-4 mt-2 rounded-lg shadow-sm
    cursor-pointer hover:bg-gray-50 transition duration-200
`

const StarIcon = tw.img`
    bg-gray-400 w-10 h-10 p-2 rounded-full mr-3
`

const SavedPlacesText = tw.div`
    text-base font-medium
`

const ConfirmButtonContainer = tw.div`
    bg-black text-white mx-4 mt-4 px-4 py-3 text-center text-lg font-medium 
    rounded-lg cursor-pointer hover:bg-gray-900 transition duration-200
    shadow-md
`

const RecentSearchesContainer = tw.div`
    bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm
`;

const RecentSearchesTitle = tw.h3`
    text-lg font-semibold mb-3 text-gray-700
`;

const RecentSearchItem = tw.div`
    flex items-center justify-between
    p-3 border-b border-gray-100 
    hover:bg-gray-50 cursor-pointer 
    transition duration-200
    last:border-b-0
`;

const RecentSearchIcon = tw.img`
    w-8 h-8 mr-3 opacity-50
`;

const RecentSearchDetails = tw.div`
    flex-1
`;

const FromTo = tw.div`
    text-sm text-gray-600
`;

const SearchTime = tw.div`
    text-xs text-gray-400 mt-1
`;

const DeleteButton = tw.button`
    text-gray-400 hover:text-red-500
    text-xl font-bold
    w-8 h-8
    flex items-center justify-center
    rounded-full
    transition duration-200
    focus:outline-none
`;