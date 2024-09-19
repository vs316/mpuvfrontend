"use client";
import Input from "@/components/Input";
import { useFormState } from "react-dom";
import { stepOneFormAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/components/SubmitButton";
import { useEffect, useState } from "react";
import { getUser } from "@/services/api"; // Import the getUser function
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

  // Fetch user details on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const user = await getUser(userId); // Fetch user data from the backend
          setUserData({
            firstName: user.first_name || "", // Adjust according to your API response
            lastName: user.last_name || "",
            email: user.email || "",
            phoneNumber: user.phone_number || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
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

        {/* Address Line 1 */}
        <Input
          label="Address Line 1"
          id="addressLine1"
          type="text"
          required
          value={userData.addressLine1}
          onChange={(e) =>
            setUserData({ ...userData, addressLine1: e.target.value })
          }
          errorMsg={serverErrors?.addressLine1}
        />

        {/* Address Line 2 */}
        <Input
          label="Address Line 2"
          id="addressLine2"
          type="text"
          required
          value={userData.addressLine2}
          onChange={(e) =>
            setUserData({ ...userData, addressLine2: e.target.value })
          }
          errorMsg={serverErrors?.addressLine2}
        />

        {/* Locality */}
        <Input
          label="Locality"
          id="locality"
          type="text"
          required
          value={userData.locality}
          onChange={(e) =>
            setUserData({ ...userData, locality: e.target.value })
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
          value={userData.pincode}
          onChange={(e) =>
            setUserData({ ...userData, pincode: e.target.value })
          }
          errorMsg={serverErrors?.pincode}
        />

        {/* City */}
        <Input
          label="City"
          id="city"
          type="text"
          required
          value={userData.city}
          onChange={(e) => setUserData({ ...userData, city: e.target.value })}
          errorMsg={serverErrors?.city}
        />

        {/* Checkbox to Update Address */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="updateAddress" />
          <label htmlFor="updateAddress">Update address to address book</label>
        </div>

        {/* Submit Button */}
        <SubmitButton text="Continue" submittingText="Processing..." />
      </div>
    </form>
  );
}
