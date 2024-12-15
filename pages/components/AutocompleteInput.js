import { useState, useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components';

const AutocompleteInput = ({ placeholder, value, onChange, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Add click outside listener
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getSuggestions = async (input) => {
        if (input.length < 2) return;
        
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?access_token=pk.eyJ1IjoiZGV2bGlucm9jaGEiLCJhIjoiY2t2bG82eTk4NXFrcDJvcXBsemZzdnJoYSJ9.aq3RAvhuRww7R_7q-giWpA&country=IN`
            );
            const data = await response.json();
            setSuggestions(data.features);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        onChange(value);
        getSuggestions(value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        onChange(suggestion.place_name);
        onSelect(suggestion);
        setShowSuggestions(false);
    };

    return (
        <InputWrapper ref={wrapperRef}>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => value.length >= 2 && setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
                <SuggestionsList>
                    {suggestions.map((suggestion) => (
                        <SuggestionItem
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <LocationIcon>📍</LocationIcon>
                            <SuggestionText>
                                <MainText>{suggestion.text}</MainText>
                                <SubText>{suggestion.place_name}</SubText>
                            </SuggestionText>
                        </SuggestionItem>
                    ))}
                </SuggestionsList>
            )}
        </InputWrapper>
    );
};

export default AutocompleteInput;

const InputWrapper = tw.div`
    relative flex-1
`;

const Input = tw.input`
    h-12 w-full bg-gray-50 rounded-lg p-3 outline-none border border-gray-100 
    focus:border-gray-300 transition duration-200 text-sm
`;

const SuggestionsList = tw.div`
    absolute w-full bg-white mt-1 rounded-lg shadow-lg border border-gray-100
    max-h-64 overflow-y-auto z-50
`;

const SuggestionItem = tw.div`
    flex items-center p-3 hover:bg-gray-50 cursor-pointer transition duration-200
`;

const LocationIcon = tw.span`
    mr-3 text-gray-400
`;

const SuggestionText = tw.div`
    flex-1
`;

const MainText = tw.div`
    font-medium text-sm
`;

const SubText = tw.div`
    text-xs text-gray-500 mt-0.5
`; 