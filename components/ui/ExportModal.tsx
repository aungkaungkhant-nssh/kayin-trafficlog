import { ExportTypeEnum } from '@/utils/enum/ExportType';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Divider, Modal, Portal, RadioButton } from 'react-native-paper';
import AppButton from './AppButton';

interface PropsTypes {
    visible: boolean,
    exportType: ExportTypeEnum,
    onConfirm: () => void;
    onCancel: () => void;
    onShare: () => void;
    setExportType: (value: ExportTypeEnum) => void;
}

const ExportModal = (
    {

        visible,
        onCancel,
        onConfirm,
        onShare,
        exportType,
        setExportType
    }: PropsTypes
) => {


    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onCancel}
                contentContainerStyle={{
                    backgroundColor: 'white',
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    margin: 20,
                    borderRadius: 8,
                }}
            >
                <View>
                    <Text style={{ fontSize: 16, fontFamily: 'Myanmar-Bold', marginBottom: 12, textAlign: "center" }}>မှတ်တမ်း ရွေးချယ်ပါ</Text>
                    <RadioButton.Group
                        onValueChange={(value) => setExportType(value as ExportTypeEnum)}
                        value={exportType}
                    >
                        <RadioButton.Item
                            label="နေ့စဉ်မှတ်တမ်းများ"
                            value={ExportTypeEnum.All}
                        />
                        <RadioButton.Item
                            label="တရားစွဲထားသော မှတ်တမ်းများ"
                            value={ExportTypeEnum.Filed}
                        />
                        {/* <RadioButton.Item
                            label="တရားမစွဲသေးသော မှတ်တမ်းများ"
                            value={ExportTypeEnum.UnFiled}
                        /> */}

                    </RadioButton.Group>
                    <Divider />
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                        <AppButton
                            mode='outlined'
                            label='share'
                            onPress={onShare}
                            icon="share"
                        />
                        <AppButton
                            label='Download'
                            onPress={onConfirm}
                            icon="download"
                        />
                    </View>

                </View>

            </Modal>
        </Portal>
    )
}

export default ExportModal;

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        justifyContent: "space-between"
    }
})
