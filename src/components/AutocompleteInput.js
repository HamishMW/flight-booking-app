import React, { useMemo, useState, memo, useRef } from 'react';
import styled from 'styled-components/macro';
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox';
import Input from 'components/Input';
import { useThrottle } from 'hooks';
import { rgba } from 'utils/color';

function AutocompleteInput({
  value,
  data,
  matchKey,
  onChange,
  onSelect,
  className,
  style,
  showSuggestions,
  renderOption,
  limit,
  ...props
}) {
  const results = useMatch(value, data, matchKey);
  const [interacted, setInteracted] = useState(false);
  const [typed, setTyped] = useState(false);
  const suggestionsVisible = showSuggestions && interacted && !value;
  const inputRef = useRef();

  const handleInputChange = event => {
    setTyped(true);
    onChange(event.target.value);
  };

  const handleSelect = value => {
    // Prevent weird focus shifting by forcing an update to onChange
    requestAnimationFrame(() => onChange(value));
    onSelect(value);
    setTyped(false);
  };

  const renderResults = resultData => (
    <AutoCompletePopover as={ComboboxPopover}>
      <AutoCompleteList as={ComboboxList}>
        {resultData.slice(0, limit).map((result, index) => (
          <AutoCompleteOption
            as={ComboboxOption}
            key={index}
            value={result[matchKey]}
          >
            {renderOption && renderOption(result)}
          </AutoCompleteOption>
        ))}
      </AutoCompleteList>
    </AutoCompletePopover>
  );

  return (
    <Combobox
      onSelect={handleSelect}
      className={className}
      openOnFocus={showSuggestions}
      style={style}
    >
      <Input
        as={ComboboxInput}
        ref={inputRef}
        onChange={handleInputChange}
        onFocus={() => setInteracted(true)}
        value={value}
        {...props}
      />
      {!results.length && suggestionsVisible && renderResults(data)}
      {!!results.length && typed && renderResults(results)}
    </Combobox>
  );
}

AutocompleteInput.defaultProps = {
  matchKey: 'value',
  limit: 5,
  onSelect: () => ({}),
};

function useMatch(term, data, key = 'value') {
  let throttledTerm = useThrottle(term, 100);
  return useMemo(() => term.trim() === ''
    ? []
    : data.filter(item => item[key].toLowerCase().includes(term.toLowerCase()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [throttledTerm]);
}

const AutoCompletePopover = styled.div`
  box-shadow: ${props => props.theme.shadowPopover};
  padding: 10px;
  border-radius: ${props => props.theme.borderRadius}px;
  background-color: ${props => props.theme.colorSurface};
`;

const AutoCompleteList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-gap: 2px;
`;

const AutoCompleteOption = styled.li`
  padding: 10px 8px;
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius}px;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  font-size: 14px;

  &:hover,
  &:focus,
  &[aria-selected="true"] {
    background-color: ${props => rgba(props.theme.colorText, 0.08)};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => rgba(props.theme.colorText, 0.2)};
  }
`;

export default memo(AutocompleteInput);
