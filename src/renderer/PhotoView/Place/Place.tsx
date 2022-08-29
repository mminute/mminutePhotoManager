import { useState } from 'react';
import { Box, Button, Flex, Heading, Spinner, Toast } from 'gestalt';
import countries from 'iso3166-2-db/i18n/dispute/UN/en';
import GenericComboBox from './GenericComboBox';
import { PlaceType } from '../../../DataManager/DataManager';
import './Place.css';

type Option = { label: string; value: string };
type MaybeOption = Option | undefined;
type CitiesMap = Record<string, Record<string, string[]>>;

interface Props {
  latitude: number | null;
  longitude: number | null;
  countrySearchTerm: string;
  setCountrySearchTerm: (newVal: string) => void;
  selectedCountry: MaybeOption;
  setSelectedCountry: (newCountry: MaybeOption) => void;
  stateSearchTerm: string;
  setStateSearchTerm: (newVal: string) => void;
  selectedState: MaybeOption;
  setSelectedState: (newState: MaybeOption) => void;
  placesMap: PlaceType[];
  placeName: string;
  setPlaceName: (newVal: string) => void;
  cityName: string;
  setCityName: (newVal: string) => void;
  selectedCity: MaybeOption;
  setSelectedCity: (newCity: MaybeOption) => void;
  citiesMap: CitiesMap;
}

const countryOptions = Object.keys(countries).map((countryCode) => ({
  value: countryCode,
  label: countries[countryCode].name,
}));

function makeStateOptions(countryCode: string | undefined): Option[] {
  return countries[countryCode]?.regions.map((region: { name: string }) => ({
    label: region.name,
    value: region.name,
  }));
}

function makeCityOptions(
  citiesMap: CitiesMap,
  countryCode: string | undefined,
  stateCode: string | undefined
): Option[] {
  return ((citiesMap[countryCode] || {})[stateCode] || []).map((c: string) => ({
    label: c,
    value: c,
  }));
}

export default function Place({
  latitude,
  longitude,
  countrySearchTerm,
  setCountrySearchTerm,
  selectedCountry,
  setSelectedCountry,
  stateSearchTerm,
  setStateSearchTerm,
  selectedState,
  setSelectedState,
  placesMap,
  placeName,
  setPlaceName,
  cityName,
  setCityName,
  selectedCity,
  setSelectedCity,
  citiesMap,
}: Props) {
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const statesOptions = makeStateOptions(selectedCountry?.value);
  const cityOptions = makeCityOptions(
    citiesMap,
    selectedCountry?.value,
    selectedState?.value
  );

  const placesWithLabel = placesMap.map((p) => {
    const val = [p.name, p.countryCode, p.stateProvince, p.city]
      .filter(Boolean)
      .join(' - ');

    return {
      ...p,
      label: val,
      value: val,
    };
  });

  const showError = (err: string) => {
    setError(err);
    setTimeout(() => {
      setError(null);
    }, 2500);
  };

  const handleSelectCountry = (newCountry: MaybeOption) => {
    setSelectedCountry(newCountry);

    if (
      newCountry &&
      selectedState &&
      !countries[newCountry?.value]?.regions.find(
        (region: { name: string }) =>
          region.name.toLowerCase() === selectedState.label.toLowerCase()
      )
    ) {
      setSelectedState(undefined);
      setStateSearchTerm('');

      if (selectedCity) {
        setSelectedCity(undefined);
        setCityName('');
      }
    }
  };

  const handleSelectState = (newState: MaybeOption) => {
    setSelectedState(newState);

    if (
      newState &&
      selectedCity &&
      !(
        (citiesMap[selectedCountry?.value] || {})[newState.value] || []
      ).includes(selectedCity.value)
    ) {
      setSelectedCity(undefined);
      setCityName('');
    }
  };

  const setPlaceData = ({
    city,
    countryCode,
    stateProvince,
  }: {
    city: string;
    countryCode: string;
    stateProvince: string;
  }) => {
    const autofillCountry = countryOptions.find(
      (option) => option.value === countryCode
    );

    if (autofillCountry) {
      setSelectedCountry(autofillCountry);
      setCountrySearchTerm(autofillCountry.label);

      const autofillState = makeStateOptions(autofillCountry.value).find(
        (state) => state.value === stateProvince
      );

      if (autofillState) {
        setSelectedState(autofillState);
        setStateSearchTerm(autofillState.label);
      }
    }

    if (city) {
      setSelectedCity({ label: city, value: city });
      setCityName(city);
    }
  };

  const handleFetchLocation = async () => {
    setWaiting(true);
    fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    )
      .then(async (resp) => {
        const data = await resp.json();

        if (!resp.ok) {
          const err = (data && data.message) || resp.status;
          console.log('reverse geocode response error', err);
          setWaiting(false);
          showError(`Reverse geocode responded with an error: ${err}`);
          return null;
        }

        const { city, countryCode, principalSubdivision } = data;

        setPlaceData({
          city,
          countryCode,
          stateProvince: principalSubdivision,
        });

        setWaiting(false);

        return null;
      })
      .catch((err) => {
        console.log('reverse geocode request error', err);
        setWaiting(false);
        showError(`Reverse geocode request error: ${err}`);
      });
  };

  const handleSelectPlace = (selectedOption: MaybeOption) => {
    const foundPlace = placesWithLabel.find(
      (p) => p.value === selectedOption?.value
    );

    if (foundPlace) {
      setPlaceName(foundPlace.name);

      setPlaceData({
        city: foundPlace.city || '',
        countryCode: foundPlace.countryCode || '',
        stateProvince: foundPlace.stateProvince || '',
      });
    }
  };

  return (
    <>
      {waiting && (
        <Box
          alignItems="center"
          bottom
          justifyContent="center"
          left
          position="fixed"
          right
          top
          display="flex"
          dangerouslySetInlineStyle={{
            __style: { backgroundColor: 'rgba(255, 255, 255, 0.7)' },
          }}
        >
          <Spinner accessibilityLabel="Waiting..." show />
        </Box>
      )}

      <Box marginTop={2} paddingY={2}>
        <Heading size="300">Place</Heading>
      </Box>

      <Flex direction="column" gap={4}>
        <GenericComboBox
          controlledSelect
          id="placeName"
          label="Location name"
          noResultText="No location found"
          placeholder="Enter a location"
          searchTerm={placeName}
          setSearchTerm={setPlaceName}
          selectedOption={undefined}
          onSelect={handleSelectPlace}
          options={placesWithLabel}
        />

        <Flex direction="row" gap={4} justifyContent="between" alignItems="end">
          <Flex.Item flex="grow">
            <GenericComboBox
              id="country"
              label="Country"
              noResultText="No country found"
              placeholder="Select a country"
              searchTerm={countrySearchTerm}
              setSearchTerm={setCountrySearchTerm}
              selectedOption={selectedCountry}
              onSelect={handleSelectCountry}
              options={countryOptions}
            />
          </Flex.Item>

          {latitude && longitude && (
            <Box>
              <Button
                text="Fill from GPS"
                size="md"
                onClick={handleFetchLocation}
              />
            </Box>
          )}
        </Flex>

        <GenericComboBox
          id="stateProvince"
          label="State/Province"
          noResultText="No state/province found"
          placeholder="Select a state/province"
          searchTerm={stateSearchTerm}
          setSearchTerm={setStateSearchTerm}
          selectedOption={selectedState}
          onSelect={handleSelectState}
          options={statesOptions || []}
        />

        <GenericComboBox
          id="city"
          label="City"
          noResultText="No city found"
          placeholder="Select a city"
          searchTerm={cityName}
          setSearchTerm={setCityName}
          selectedOption={selectedCity}
          onSelect={setSelectedCity}
          options={cityOptions}
        />
      </Flex>

      {error && (
        <Box
          bottom
          display="flex"
          justifyContent="center"
          left
          marginBottom={6}
          position="fixed"
          right
        >
          <div className="toast-slide">
            <Toast text={`Error! ${error}`} variant="error" />
          </div>
        </Box>
      )}
    </>
  );
}
