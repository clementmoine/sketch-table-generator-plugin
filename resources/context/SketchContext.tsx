import React, { createContext, useContext, useEffect, useReducer } from 'react';

import Options from '../types/options.types';
import { defaultOptions } from '../types/options.defaults';

interface SketchContextValue {
  selectedTable?: string;
  options?: Options;
}

// Create context to store data from Sketch
const SketchContext = createContext<SketchContextValue>({});

// Custom hook to access the context
export const useSketchContext = (): SketchContextValue => useContext(SketchContext);

interface SketchContextProviderProps {
    children?: React.ReactNode;
}


type SketchContextAction = {
  type: 'SET_OPTIONS' | 'SET_SELECTED_TABLE';
  payload: any;
};

// Provider component
export const SketchContextProvider: React.FC<SketchContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer((state: SketchContextValue, action: SketchContextAction): SketchContextValue => {
    switch (action.type) {
      case 'SET_OPTIONS':
        return {
          ...state,
          options: action.payload
        }
      case 'SET_SELECTED_TABLE':
        return {
          ...state,
          selectedTable: action.payload
        };
      default:
        return state;
    }
  }, {
    options: defaultOptions
  });

  useEffect(() => {
    // Expose the setOptions and setSelectedTable functions in the window scope for plugin calls
    (window as any).setOptions = function (options: Options) {
      dispatch({ type: 'SET_OPTIONS', payload: options });
    };

    (window as any).setSelectedTable = function (selectedTable: string) {
      dispatch({ type: 'SET_SELECTED_TABLE', payload: selectedTable });
    };

    // Clean up the window scope when the component unmounts
    return () => {
      delete (window as any).setOptions;
      delete (window as any).setSelectedTable;
    };
  }, []);

  return (
    <SketchContext.Provider value={state}>
      {children}
    </SketchContext.Provider>
  );
};
