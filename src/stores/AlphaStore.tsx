import { createContext, PropsWithChildren, useContext } from "react";


export interface IAlphaCtx {
    loaded: boolean
}

const DEFAULT_CTX:IAlphaCtx = {
    loaded: false
}

const AlphaCtx = createContext(DEFAULT_CTX)
const AlphaBridgeCtx = createContext(DEFAULT_CTX)

export const useAlphaCtx = () => useContext(AlphaCtx)
export const useAlphaBridgeCtx = () => useContext(AlphaBridgeCtx)

export const AlphaContainer = ({ children }: PropsWithChildren) => {
  
    return (
        <AlphaCtx.Provider value={DEFAULT_CTX}>
            {children}
        </AlphaCtx.Provider>
    )
}

export const AlphaBridgeContainer = ({ children, ...ctx }: PropsWithChildren<IAlphaCtx>) => {

    return (
        <AlphaBridgeCtx.Provider value={{...ctx}}>
            {children}
        </AlphaBridgeCtx.Provider>
    )
}



