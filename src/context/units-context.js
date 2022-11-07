import { createContext } from "react";

export const UnitsContext = createContext({
    units:'metric',
    setUnits:()=>{}
});