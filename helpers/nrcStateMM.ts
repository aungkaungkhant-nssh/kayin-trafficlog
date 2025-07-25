import nrcData from '@/assets/NRC_DATA.json';

export const getNrcStateMM = (en: string) => {
    const match = nrcData.nrcStates.find((state) => state.number.en === en);
    return `${match?.number.mm}/`;
};