import {createContext, ReactNode, useContext, useState} from "react";

type ConfirmOptions = {
  message: string;
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider = ({children}: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = (options: ConfirmOptions) => {
    setMessage(options.message);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleResult = (result: boolean) => {
    setMessage(null);
    resolver?.(result);
  };

  return (
    <ConfirmContext.Provider value={{confirm}}>
      {children}
      {message && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
          <div className="absolute top-0 left-0 w-full flex justify-center z-50">
            <div
              className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg border border-gray-300 mt-4">
              <p className="mb-4 text-lg font-medium">{message}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => handleResult(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Odustani
                </button>
                <button
                  onClick={() => handleResult(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Potvrdi
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used within ConfirmProvider");
  return context.confirm;
};
