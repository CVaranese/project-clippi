import { Character, CharacterInfo, getAllCharacters, getCharacterName } from "@vinceau/slp-realtime";
import * as React from "react";
import { Field } from "react-final-form";
import Select, { components, MultiValueProps, OptionProps, OptionTypeBase, SingleValueProps } from "react-select";
import styled from "@emotion/styled";

import { ThemeMode, useTheme } from "@/styles";
import { CharacterIcon } from "../CharacterIcon";
import { CharacterLabel } from "./CharacterLabel";

export const sortedCharacterInfos: CharacterInfo[] = getAllCharacters().sort((a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});

export const sortedCharacterIDs: Character[] = sortedCharacterInfos.map((c) => c.id);

const SingleValue: React.ComponentType<SingleValueProps<OptionTypeBase>> = (props) => {
  return (
    <components.SingleValue {...props}>
      <CharacterLabel characterId={props.data.value} name={props.data.label} />
    </components.SingleValue>
  );
};

const MultiValueRemove: React.ComponentType<MultiValueProps<OptionTypeBase>> = (props) => {
  return (
    <components.MultiValueRemove {...props}>
      <CharacterIcon character={props.data.value} />
    </components.MultiValueRemove>
  );
};

const Option: React.ComponentType<OptionProps<OptionTypeBase>> = (props) => {
  const { themeName } = useTheme();
  const { innerProps, innerRef } = props;
  const Outer = styled.div`
    padding: 5px 10px;
    ${({ theme }) => `
    &:hover {
      background-color: ${themeName === ThemeMode.DARK ? theme.foreground2 : "#F8F8F8"};
      ${
        themeName === ThemeMode.DARK &&
        `
        color: ${theme.foreground};
      `
      }
    }`}
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
  const parseValue = (val: any) =>
    val === undefined || val === "" || val === null ? undefined : val.map ? val.map(optionToValue) : optionToValue(val);
  const formatValue = (val: any) =>
    val === undefined || val === "" || val === null ? undefined : val.map ? val.map(valueToOption) : valueToOption(val);
  const newValue = formatValue(value);
  const newOnChange = (v: any) => onChange(parseValue(v));
  const selectOptions = options ? options : sortedCharacterIDs;
  const mainTheme = useTheme();
  const minHeight = "3.8rem";
  const customStyles: any = {
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: "0 0.8rem",
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "transparent",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      display: "none",
    }),
    control: (base: any) => ({
      ...base,
      minHeight,
    }),
    placeholder: (base: any) => ({
      ...base,
      whiteSpace: "nowrap",
      opacity: 0.4,
    }),
  };
  if (mainTheme.themeName === ThemeMode.DARK) {
    customStyles.menuList = (base: any) => ({
      ...base,
      backgroundColor: mainTheme.theme.foreground,
      color: mainTheme.theme.background,
    });
    customStyles.dropdownIndicator = (base: any) => ({
      ...base,
      padding: "0 0.8rem",
      color: mainTheme.theme.background,
    });
    customStyles.control = (base: any) => ({
      ...base,
      backgroundColor: mainTheme.theme.foreground,
      color: mainTheme.theme.background,
      minHeight,
    });
  }

  // After picking a character and clicking "Save profile" the initial click
  // seems to get eaten, requiring the user to have to click twice.
  // Only the second click actually triggers the save event, and the notice.
  // But for some reason setting onBlur to undefined fixes this issue and the
  // first issue no longer gets eaten.
  return (
    <Select
      {...rest}
      width="100%"
      value={newValue}
      onChange={newOnChange}
      onBlur={undefined}
      options={selectOptions.map(valueToOption)}
      searchable={true}
      components={{ ...components, MultiValueRemove, Option, SingleValue }}
      menuColor={mainTheme.theme.background}
      styles={customStyles}
      placeholder={`Choose your character${props.isMulti ? "s" : ""}...`}
    />
  );
};

export const CharacterSelectAdapter = (props: any) => {
  const { name, ...rest } = props;
  return (
    <Field name={name}>
      {(fprops) => {
        const { input, ...frest } = fprops;
        return <CharacterSelect {...rest} {...frest} {...input} />;
      }}
    </Field>
  );
};
