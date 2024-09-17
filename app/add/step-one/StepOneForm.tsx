"use client";
import Input from "@/components/Input";
import { useFormState } from "react-dom";
import { stepOneFormAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/components/SubmitButton";
import { useEffect, useState } from "react";
import { fetchUserDetails } from "@/services/fetchUserDetails"; // Import your fetch function

const initialState: FormErrors = {};

export default function StepOneForm() {
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
    addressLine1: "",
    addressLine2: "",
    locality: "",
    pincode: "",
    city: "",
    password: "", // Include password if necessary
  });

  // Fetch user details on component mount
  useEffect(() => {
    const fetchData = async () => {
      const userId = "USER_ID"; // Get user ID from session or context
      const user = await fetchUserDetails(userId);

      if (user) {
        setUserData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          addressLine1: user.addressLine1 || "",
          addressLine2: user.addressLine2 || "",
          locality: user.locality || "",
          pincode: user.pincode || "",
          city: user.city || "",
          password: user.password || "", // If needed
        });
      }
    };

    fetchData();
  }, []);

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        {/* Type (Forward, Return, Both) */}
        <div className="flex gap-4">
          <label className="flex items-center">
            <input type="radio" name="type" value="forward" required /> Forward
          </label>
          <label className="flex items-center">
            <input type="radio" name="type" value="return" /> Return
          </label>
          <label className="flex items-center">
            <input type="radio" name="type" value="both" /> Both
          </label>
        </div>

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
        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
