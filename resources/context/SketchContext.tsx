import React, { createContext, useContext, useEffect, useState } from 'react';

import Options from '../types/options.types';

interface SketchContextProps {
    options?: Options;
}

// Create context to store data from Sketch
const SketchContext = createContext<SketchContextProps>({});

// Custom hook to access the context
export const useSketchContext = (): SketchContextProps => useContext(SketchContext);

interface SketchContextProviderProps {
    children?: React.ReactNode;
}

// Provider component
export const SketchContextProvider: React.FC<SketchContextProviderProps> = ({ children }) => {
  const [options, setOptions] = useState<SketchContextProps['options']>({});

  useEffect(() => {
    // Expose the setOptions in the window scope for plugin call
    (window as any).setOptions = function (options: Options) {
      setOptions(options);
    };

    // Clear the scope
    return () => {
      delete (window as any).sendOptions;
    };
  }, []);

  return (
    <SketchContext.Provider value={{options}}>
      {children}
    </SketchContext.Provider>
  );
};
