import React, { useState } from "react";

//const [accNo, setAccNo]=useState('')
let name='Ian';

const setName=(value)=>{
    value=newValue;
}
const AppContext = React.createContext([name, (value)=>{name=value}]);

const anotherContext = (value)=>{
    const[name, setName] = useState(value);
    const AppContext = React.createContext([name, setName]);
    return AppContext;
}

export const AppProvider = ({children})=>{
    const [contextAccountNo, setContextAccountNo] = useState('Ian');
    const changeAccountNo=(value)=>{
        setContextAccountNo(value)
    }
    return (
        <AppContext.Provider value={[contextAccountNo, changeAccountNo]}>
            {children}
        </AppContext.Provider>
    )
}

export default anotherContext