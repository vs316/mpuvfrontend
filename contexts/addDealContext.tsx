"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  NewDealInitialValuesType,
  NewDealType,
  newDealInitialValuesSchema,
} from "@/schemas";

const defaultDeal: NewDealInitialValuesType = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  locality: "",
  pincode: "",
  city: "",
  shiptocompany: "",
  shiptofirstName: "",
  shiptolastName: "",
  shiptoemail: "",
  shiptophoneNumber: "",
  shiptoaddressLine1: "",
  shiptoaddressLine2: "",
  shiptolocality: "",
  shiptopincode: "",
  shiptocity: "",
  descriptionOfGoods: "",
  packages: [
    {
      weight: 0, // You can set default value to 0
      valueofgoods: 0,
      description: "", // Default empty string
      instructions: "", // Default empty string
    },
  ],
};

// Local Storage keys
const LOCAL_STORAGE_KEY = "multi-page-form-demo-newDealData";
type AddDealContextType = {
  newDealData: NewDealInitialValuesType;
  dataLoaded: boolean; // Include this if it's not already included
  updateNewDealDetails: (dealDetails: Partial<NewDealType>) => void; // Add this line
  resetLocalStorage: () => void; // Ensure this exists as well
};

export const AddDealContext = createContext<AddDealContextType | null>(null);

export const AddDealContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [newDealData, setNewDealData] =
    useState<NewDealInitialValuesType>(defaultDeal);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    readFromLocalStorage();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      saveDataToLocalStorage(newDealData);
    }
  }, [newDealData, dataLoaded]);

  // Update deal details
  const updateNewDealDetails = useCallback(
    (dealDetails: Partial<NewDealType>) => {
      setNewDealData((prevDealData) => ({
        ...prevDealData,
        ...dealDetails,
        packages: dealDetails.packages || prevDealData.packages,
      }));
    },
    []
  );

  // Save New Deal data to localStorage
  const saveDataToLocalStorage = (
    currentDealData: NewDealInitialValuesType
  ) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDealData));
  };

  // Read New Deal data from localStorage
  const readFromLocalStorage = () => {
    const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!loadedDataString) return setNewDealData(defaultDeal);
    const validated = newDealInitialValuesSchema.safeParse(
      JSON.parse(loadedDataString)
    );

    if (validated.success) {
      setNewDealData(validated.data);
    } else {
      setNewDealData(defaultDeal);
    }
  };

  // Reset both storage items
  const resetLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setNewDealData(defaultDeal);
  };

  const contextValue = useMemo(
    () => ({
      newDealData,
      dataLoaded,
      updateNewDealDetails,
      resetLocalStorage,
    }),
    [newDealData, dataLoaded, updateNewDealDetails]
  );

  return (
    <AddDealContext.Provider value={contextValue}>
      {children}
    </AddDealContext.Provider>
  );
};

export function useAddDealContext() {
  const context = useContext(AddDealContext);
  if (context === null) {
    throw new Error(
      "useAddDealContext must be used within a AddDealContextProvider"
    );
  }
  return context;
}
