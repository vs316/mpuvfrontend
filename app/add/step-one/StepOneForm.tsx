"use client";
import Input from "@/components/Input";
import { useFormState } from "react-dom";
import { stepOneFormAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/components/SubmitButton";
import { useEffect, useState } from "react";
import { getUser, postNewAddress, getUserAddresses } from "@/services/api";
import { useUser } from "@/contexts/userContext";
const initialState: FormErrors = {};
// TODO: 1. based on User_id, in step one, for (ship to) , user details to be fetched and auto-filled into the relevant fields.
// TODO: 2. User default addresses to be fetched and displayed as a drop-down in the address fields in step-one form.Do this by doing a GET request to http://localhost:3000/address/${addressID}
// TODO: 3. If user enters a new ship from address and checks the update address to address book checkbox, post the new address details to the address table for that user.

export default function StepOneForm() {
  const userContext = useUser();
  const userId = userContext?.userId; // Use optional chaining

  const [serverErrors, formAction] = useFormState(
    stepOneFormAction,
    initialState
  );

  // State to hold user details
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  interface Address {
    address_id: number; // Add this line
    addressLine1: string;
    addressLine2?: string;
    locality?: string;
    city: string;
    state: string;
    pincode: string;
  }
  // State to hold user's addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [saveAddress, setSaveAddress] = useState(false); // Checkbox state

  // Fetch user details on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId != null) {
          console.log("Fetching user data for userId:", userId);
          const user = await getUser(userId);
          // Fetch user data from the backend
          console.log("User data fetched:", user);
          setUserData({
            firstName: user.first_name || "", // Adjust according to your API response
            lastName: user.last_name || "",
            email: user.email || "",
            phoneNumber: user.phone_number || "",
          });
          const userAddresses = await getUserAddresses(userId); // Fetch user addresses
          console.log("User addresses fetched:", userAddresses);
          setAddresses(userAddresses); // Set the address dropdown
        } else {
          console.log("User ID is null or undefined."); // Debug if userId is missing
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, [userId]);

  // Handle address selection from dropdown
  const handleAddressSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = addresses.find(
      (address) => address.address_id === parseInt(event.target.value)
    );
    if (selected) {
      setSelectedAddress(selected);
    }
  };

  // Handle new address submission
  const handleSubmitNewAddress = async () => {
    if (saveAddress && userId != null) {
      try {
        await postNewAddress(userId, newAddress);
        alert("New address saved!");
      } catch (error) {
        console.error("Error saving new address:", error);
      }
    }
  };
  return (
    <form
      action={formAction}
      className="flex flex-1 flex-col items-center"
      onSubmit={handleSubmitNewAddress}
    >
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        {/* Type (Forward, Return, Both) */}
        {/* <div className="flex gap-4">
          <label className="flex items-center">
            <input type="radio" name="type" value="forward" required /> Forward
          </label>
          <label className="flex items-center">
            <input type="radio" name="type" value="return" /> Return
          </label>
          <label className="flex items-center">
            <input type="radio" name="type" value="both" /> Both
          </label>
        </div> */}

        {/* First Name */}
        <Input
          label="First Name"
          id="firstName"
          type="text"
          required
          value={userData.firstName} // Bind the value to state
          onChange={(e) =>
            setUserData({ ...userData, firstName: e.target.value })
          } // Update state
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
          pattern="[0-9]{10}" // Assuming 10-digit phone numbers
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
        {/* Address Line 1 */}
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

            {/* Address Line 2 */}
            <Input
              label="Address Line 2"
              id="addressLine2"
              type="text"
              required
              value={newAddress.addressLine2}
              onChange={(e) =>
                setNewAddress({ ...newAddress, addressLine2: e.target.value })
              }
              errorMsg={serverErrors?.addressLine2}
            />

            {/* Locality */}
            <Input
              label="Locality"
              id="locality"
              type="text"
              required
              value={newAddress.locality}
              onChange={(e) =>
                setNewAddress({ ...newAddress, locality: e.target.value })
              }
              errorMsg={serverErrors?.locality}
            />

            {/* Pincode */}
            <Input
              label="Pincode"
              id="pincode"
              type="text"
              required
              pattern="[0-9]{6}" // Assuming 6-digit pincode
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
              errorMsg={serverErrors?.pincode}
            />

            {/* City */}
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
