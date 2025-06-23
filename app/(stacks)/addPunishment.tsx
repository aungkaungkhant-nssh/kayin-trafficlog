import nrcData from '@/assets/NRC_DATA.json';
import FirstInfo from '@/components/info/FirstInfo';
import SecondInfo from '@/components/info/SecondInfo';
import ThirdInfo from '@/components/info/ThirdInfo';
import Header from '@/components/ui/Header';
import { searchSchema, SearchSchemaType } from '@/schema/search.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';


const AddPunishment = () => {
    const [currentInfo, setCurrentInfo] = useState<number>(1);

    const {
        watch,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SearchSchemaType>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            name: '',
            fatherName: '',
            nrcState: '3',
            nrcTownShip: 'ဘအန',
            nrcType: 'နိုင်',
            nrcNumber: "222222",
            vehicleNumber: '',
            vehicleLicense: '',

        }
    });

    const onSubmit = async (data: SearchSchemaType) => {

    }


    const getNrcStateMM = (en: string) => {
        const match = nrcData.nrcStates.find((state) => state.number.en === en);
        return `${match?.number.mm} /`;
    };

    console.log(currentInfo)
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <Header
                title='ပြစ်မှုထည့်မည်'
            />

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    {/* <View style={styles.noticeWrapper}>
                        <Text style={styles.noticeText}>

                        </Text>
                    </View> */}
                    {
                        currentInfo === 1 && (
                            <FirstInfo
                                control={control}
                                watch={watch}
                                setCurrentInfo={setCurrentInfo}
                            />
                        )
                    }

                    {
                        currentInfo === 2 && (
                            <SecondInfo
                                control={control}
                                watch={watch}
                                setCurrentInfo={setCurrentInfo}
                            />
                        )
                    }

                    {
                        currentInfo === 3 && (
                            <ThirdInfo
                                control={control}
                                watch={watch}
                                handleSubmit={() => handleSubmit(onSubmit)}
                            />
                        )
                    }



                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AddPunishment;

const styles = StyleSheet.create({
    inputWrapper: {
        marginBottom: 15,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f2f5',
        justifyContent: 'center',
        alignItems: "center",
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
        width: '100%',   // Full width with padding
        maxWidth: 400,   // Max width for better design
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        color: "red"
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    dropDownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flexWrap: 'wrap',
    },
    noticeWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    icon: {
        marginRight: 6,
        marginTop: 2,
    },
});
