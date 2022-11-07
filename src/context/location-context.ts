import { createContext, SetStateAction } from "react";

interface ILocationContext {
    location: string,
    setLocation:React.Dispatch<SetStateAction<string>>;
};

export const LocationContext = createContext<ILocationContext>({
    location:'',
    setLocation:()=>{}
});