"use client";
import Input from "@/components/Input";
import { useFormState } from "react-dom";
import { stepOneFormAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/components/SubmitButton";
import { useEffect, useState } from "react";
import { getOrCreateUserId } from "@/app/utils/UserUtils";

const initialState: FormErrors = {};

// Define Address Interface
interface Address {
  address_id: number;
  addressLine1: string;
  addressLine2?: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
}

export default function StepOneForm() {
  const [serverErrors, formAction] = useFormState(
    stepOneFormAction,
    initialState
  );

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [addresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [userId, setUserId] = useState("");

  // Load data from localStorage on component mount
  useEffect(() => {
    // const storedUserData = localStorage.getItem("userData");
    // const storedNewAddress = localStorage.getItem("newAddress");
    // const storedSelectedAddress = localStorage.getItem("selectedAddress");

    // if (storedUserData) setUserData(JSON.parse(storedUserData));
    // if (storedNewAddress) setNewAddress(JSON.parse(storedNewAddress));
    // if (storedSelectedAddress)
    //   setSelectedAddress(JSON.parse(storedSelectedAddress));

    // Fetch or create a user ID using the getOrCreateUserId function
    const userIdFromStorage = getOrCreateUserId();
    setUserId(userIdFromStorage);
  }, []);

  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [saveAddress, setSaveAddress] = useState(false); // Checkbox state

  // Handle address selection from dropdown
  const handleAddressSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = addresses.find(
      (address) => address.address_id === parseInt(event.target.value)
    );
    if (selected) {
      setSelectedAddress(selected);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // alert("Form data saved locally. Proceed to the next step.");
  //   // Perform validation here if needed
  //   //const errors = stepOneFormAction(undefined, FormData);

  //   // if (errors) {
  //   //   // Handle errors
  //   //   console.error(errors);
  //   //   return; // Stop the submission if there are errors
  //   // }

  //   // router.push(AddRoutes.SHIPTO_INFO);
  // };

  return (
    <form
      action={formAction}
      className="flex flex-1 flex-col items-center"
      //onSubmit={handleSubmit}
    >
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        {/* User ID Display */}
        <div className="flex flex-col">
          <label htmlFor="userId">Current User ID</label>
          <input
            id="userId"
            type="text"
            value={userId}
            readOnly
            className="bg-gray-100 border border-gray-300 p-2 rounded text-slate-500"
          />
        </div>

        {/* First Name */}
        <Input
          label="First Name"
          id="firstName"
          type="text"
          required
          value={userData.firstName}
          onChange={(e) =>
            setUserData({ ...userData, firstName: e.target.value })
          }
          errorMsg={serverErrors?.firstName}
        />

        {/* Last Name */}
        <Input
          label="Last Name"
          id="lastName"
          type="text"
          required
          value={userData.lastName}
          onChange={(e) =>
            setUserData({ ...userData, lastName: e.target.value })
          }
          errorMsg={serverErrors?.lastName}
        />

        {/* Email Address */}
        <Input
          label="Email Address"
          id="email"
          type="email"
          required
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          errorMsg={serverErrors?.email}
        />

        {/* Phone Number */}
        <Input
          label="Phone Number"
          id="phoneNumber"
          type="tel"
          required
          pattern="[0-9]{10}"
          value={userData.phoneNumber}
          onChange={(e) =>
            setUserData({ ...userData, phoneNumber: e.target.value })
          }
          errorMsg={serverErrors?.phoneNumber}
        />

        {/* Address Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="addressSelect">Select Address</label>
          <select
            id="addressSelect"
            value={selectedAddress?.address_id || ""}
            onChange={handleAddressSelect}
          >
            <option value="">Select Address</option>
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <option key={address.address_id} value={address.address_id}>
                  {address.addressLine1}, {address.city}, {address.pincode}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No addresses found.
              </option>
            )}
          </select>
        </div>

        {/* Address Fields */}
        {selectedAddress === null && (
          <>
            <Input
              label="Address Line 1"
              id="addressLine1"
              type="text"
              required
              value={newAddress.addressLine1}
              onChange={(e) =>
                setNewAddress({ ...newAddress, addressLine1: e.target.value })
              }
              errorMsg={serverErrors?.addressLine1}
            />

            <Input
              label="Address Line 2"
              id="addressLine2"
              type="text"
              value={newAddress.addressLine2}
              onChange={(e) =>
                setNewAddress({ ...newAddress, addressLine2: e.target.value })
              }
              errorMsg={serverErrors?.addressLine2}
            />

            <Input
              label="Locality"
              id="locality"
              type="text"
              value={newAddress.locality}
              onChange={(e) =>
                setNewAddress({ ...newAddress, locality: e.target.value })
              }
              errorMsg={serverErrors?.locality}
            />

            <Input
              label="Pincode"
              id="pincode"
              type="text"
              required
              pattern="[0-9]{6}"
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
              errorMsg={serverErrors?.pincode}
            />

            <Input
              label="City"
              id="city"
              type="text"
              required
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
              errorMsg={serverErrors?.city}
            />
          </>
        )}

        {/* Checkbox to Save New Address */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="updateAddress"
            checked={saveAddress}
            onChange={(e) => setSaveAddress(e.target.checked)}
          />
          <label htmlFor="updateAddress">Update address to address book</label>
        </div>

        {/* Submit Button */}
        <SubmitButton text="Continue" submittingText="Processing..." />
      </div>
    </form>
  );
}
