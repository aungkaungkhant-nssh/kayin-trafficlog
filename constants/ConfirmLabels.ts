import { LabelTypeEnum } from "@/utils/enum/LabelEnum";

const confirmLabels = [
    {
        id: 1,
        name: "seized_date",
        label: "ဖမ်းဆည်းသည့်နေ့",
        type: LabelTypeEnum.Record
    },
    {
        id: 2,
        name: "seizure_location",
        label: "ဖမ်းဆည်းသည့်နေရာ",
        type: LabelTypeEnum.Record
    },
    {
        id: 3,
        name: "name",
        label: "ယာဉ်‌မောင်းအမည်",
        type: LabelTypeEnum.Offender
    },
    {
        id: 4,
        name: "father_name",
        label: "အဘအမည်",
        type: LabelTypeEnum.Offender
    },
    {
        id: 5,
        name: "national_id_number",
        label: "မှတ်ပုံတင်အမှတ်",
        type: LabelTypeEnum.Offender
    },
    {
        id: 6,
        name: "address",
        label: "နေရပ်လိပ်စာ",
        type: LabelTypeEnum.Offender
    },
    {
        id: 7,
        name: "vehicle_types",
        label: "ယာဉ်မော်ဒယ်",
        type: LabelTypeEnum.Vehicle
    },
    {
        id: 8,
        name: "vehicle_categories_label",
        label: "ယာဉ်အမျိုးအစား",
        type: LabelTypeEnum.Vehicle
    },
    {
        id: 9,
        name: "vehicle_license_number",
        label: "ယာဉ်လိုင်စင်",
        type: LabelTypeEnum.Vehicle
    },
    {
        id: 10,
        name: "driver_license_number",
        label: "ယာဉ်မောင်းလိုင်စင်",
        type: LabelTypeEnum.Offender
    },
    {
        id: 12,
        name: "wheel_tax",
        label: "ဝှီးတက်",
        type: LabelTypeEnum.Vehicle
    },
    {
        id: 13,
        name: "disciplinary_input",
        label: "အရေးယူပုဒ်မ",
        type: LabelTypeEnum.Record
    },
    {
        id: 14,
        name: "seizedItem_label",
        label: "သိမ်းဆည်းပစ္စည်း",
        type: LabelTypeEnum.Record
    },
    {
        id: 15,
        name: "fine_amount",
        label: "ဒဏ်ငွေ",
        type: LabelTypeEnum.Record
    }
]

export default confirmLabels;