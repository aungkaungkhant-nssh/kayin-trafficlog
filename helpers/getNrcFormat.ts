import { getNrcStateMM } from "./nrcStateMM";
import { toBurmeseNumber } from "./toBurmeseNumber";

const getNrcFormat = (nrcNumber: string, nrcState: string, nrcType: string, nrcTownShip: string) => {
    if (!nrcNumber || !nrcState || !nrcType || !nrcTownShip) return "မရှိ";
    const nrcNumberMM = toBurmeseNumber(nrcNumber);
    return `${getNrcStateMM(nrcState)}${nrcTownShip}(${nrcType})${nrcNumberMM}`;
}

export default getNrcFormat;