// components/ui/AppDropdown.tsx
import { View } from 'react-native';
import { TextInputProps } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';

interface Option {
    label: string;
    value: string;
}

interface AppDropdownProps {
    width: number
    label: string;
    value: string;
    setValue: (val: string) => void;
    options: Option[];
    inputProps?: Partial<TextInputProps>;
}


function AppDropdown({ width, label, value, setValue, options, inputProps }: AppDropdownProps) {
    return (
        <View style={{ width }}>
            <Dropdown
                label={label}
                placeholder="Select Gender"
                options={options}
                value={""}
                onSelect={() => console.log("first")}

            />
        </View>

    );
}

export default AppDropdown;


