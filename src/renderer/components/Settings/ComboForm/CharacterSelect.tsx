import { Character, CharacterInfo, getAllCharacters, getCharacterName } from "@vinceau/slp-realtime";
import * as React from "react";
import { Field } from "react-final-form";
import Select, { components, MultiValueProps, OptionProps, OptionTypeBase, SingleValueProps } from "react-select";
import styled from "styled-components";

import { CharacterIcon } from "../../Misc/CharacterIcon";

export const sortedCharacterInfos: CharacterInfo[] = getAllCharacters()
  .sort((a, b) => {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  });

export const sortedCharacterIDs: Character[] = sortedCharacterInfos.map(c => c.id);

const SingleValue: React.ComponentType<SingleValueProps<OptionTypeBase>> = (props) => {
  return (
    <components.SingleValue {...props}><CharacterLabel characterId={props.data.value} name={props.data.label} /></components.SingleValue>
  );
};

const MultiValueRemove: React.ComponentType<MultiValueProps<OptionTypeBase>> = (props) => {
  return (
    <components.MultiValueRemove {...props}><CharacterIcon character={props.data.value} /></components.MultiValueRemove>
  );
};

const CharacterLabel: React.FC<{ characterId: Character, name: string, disabled?: boolean }> = (props) => {
  const isDisabled = props.disabled;
  const LabelContainer = styled.div`
    display: flex;
    align-items: center;
    ${isDisabled && `
      opacity: 0.5;
      cursor: not-allowed;
    `}
  `;
  const Label = styled.span`
    margin-left: 10px;
  `;
  return (
    <LabelContainer>
      <CharacterIcon character={props.characterId} grayscale={isDisabled} />
      <Label>{props.name}</Label>
    </LabelContainer>
  );
};

const Option: React.ComponentType<OptionProps<OptionTypeBase>> = (props) => {
  const { innerProps, innerRef } = props;
  const Outer = styled.div`
    padding-left: 10px;
    &:hover {
      background-color: #F8F8F8;
    }
  `;
  return (
    <Outer ref={innerRef} {...innerProps}>
      <CharacterLabel characterId={props.data.value} name={props.data.label} disabled={props.data.isDisabled} />
    </Outer>
  );
};

export const CharacterSelect = (props: any) => {
  const { value, onChange, options, disabledOptions, components, ...rest } = props;
  const disabledList = disabledOptions ? disabledOptions : [];
  const optionToValue = (o: any): Character => o.value;
  const valueToOption = (c: Character) => ({
    value: c,
    label: getCharacterName(c),
    isDisabled: disabledList.includes(c),
  });
  const parseValue = (val: any) => (val === undefined || val === "" ? undefined : val.map ? val.map(optionToValue) : optionToValue(val));
  const formatValue = (val: any) => (val === undefined || val === "" ? undefined : val.map ? val.map(valueToOption) : valueToOption(val));
  const newValue = formatValue(value);
  const newOnChange = (v: any) => onChange(parseValue(v));
  const SelectContainer = styled(Select)`
    width: 100%;
  `;
  const selectOptions = options ? options : sortedCharacterIDs;
  return (<SelectContainer
    {...rest}
    value={newValue}
    onChange={newOnChange}
    options={selectOptions.map(valueToOption)}
    searchable={true}
    components={{ ...components, MultiValueRemove, Option, SingleValue }}
    styles={{
      multiValue: (base: any) => ({
        ...base,
        backgroundColor: "transparent",
      }),
      multiValueLabel: (base: any) => ({
        ...base,
        display: "none",
      }),
    }}
  />);
};

export const CharacterSelectAdapter = (props: any) => {
  const { name, ...rest } = props;
  return (<Field name={name}>
    {fprops => {
      const { input, ...frest } = fprops;
      return (
        <CharacterSelect {...rest} {...frest} {...input} />
      );
    }}
  </Field>);
};
