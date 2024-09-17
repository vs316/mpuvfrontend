"use client";
import Input from "@/components/Input";
import SubmitButton from "@/components/SubmitButton";
import { stepTwoFormAction } from "./actions";
import { useFormState } from "react-dom";
import { FormErrors } from "@/types";
//import Select from '@/components/Select'; // Assuming a Select component is available

const initialState: FormErrors = {};

export default function StepTwoForm() {
  const [serverErrors, formAction] = useFormState(
    stepTwoFormAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        {/* Address Type Selection (New Address, Saved Address) */}
        {/* <Select
          label="Address"
          id="address"
          required
          options={[
            { value: 'new', label: 'New Address' },
            { value: 'saved', label: 'Saved Address' },
          ]}
          errorMsg={serverErrors?.address}
        /> */}

        {/* Company */}
        <Input
          label="Company"
          id="company"
          type="text"
          required
          errorMsg={serverErrors?.company}
        />

        {/* First Name */}
        <Input
          label="First Name"
          id="firstName"
          type="text"
          required
          errorMsg={serverErrors?.firstName}
        />

        {/* Last Name */}
        <Input
          label="Last Name"
          id="lastName"
          type="text"
          required
          errorMsg={serverErrors?.lastName}
        />

        {/* Email Address */}
        <Input
          label="Email Address"
          id="email"
          type="email"
          required
          errorMsg={serverErrors?.email}
        />

        {/* Phone Number */}
        <Input
          label="Phone Number"
          id="phoneNumber"
          type="tel"
          required
          pattern="[0-9]{10}" // Assuming 10-digit phone number
          errorMsg={serverErrors?.phoneNumber}
        />

        {/* Address Line 1 */}
        <Input
          label="Address Line 1"
          id="addressLine1"
          type="text"
          required
          errorMsg={serverErrors?.addressLine1}
        />

        {/* Address Line 2 */}
        <Input
          label="Address Line 2"
          id="addressLine2"
          type="text"
          required
          errorMsg={serverErrors?.addressLine2}
        />

        {/* Locality */}
        <Input
          label="Locality"
          id="locality"
          type="text"
          required
          errorMsg={serverErrors?.locality}
        />

        {/* Pincode */}
        <Input
          label="Pincode"
          id="pincode"
          type="text"
          required
          pattern="[0-9]{6}" // Assuming 6-digit pincode
          errorMsg={serverErrors?.pincode}
        />

        {/* City */}
        <Input
          label="City"
          id="city"
          type="text"
          required
          errorMsg={serverErrors?.city}
        />

        {/* State */}
        {/* <Select
          label="State"
          id="state"
          required
          options={[
            { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
            // Add other states as options
          ]}
          errorMsg={serverErrors?.state}
        /> */}

        {/* Checkbox for updating the address book */}
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
