"use client";
import Input from "@/components/Input";
import SubmitButton from "@/components/SubmitButton";
import { stepTwoFormAction } from "./actions";
import { useFormState } from "react-dom";
import { FormErrors } from "@/types";
import { useState } from "react";

const initialState: FormErrors = {};
export default function StepTwoForm() {
  const [serverErrors, formAction] = useFormState(
    stepTwoFormAction,
    initialState
  );

  const [formData, setFormData] = useState({
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
    updateAddress: false,
  });

  // Handle input change with explicit type
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submit with explicit type
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Form submitted:", formData);
  //   //alert("Form data saved locally. Proceed to the next step.");
  // };

  return (
    <form
      action={formAction}
      className="flex flex-1 flex-col items-center"
      // onSubmit={handleSubmit}
    >
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        {/* Company */}
        <Input
          label="Company"
          id="shiptocompany"
          type="text"
          required
          value={formData.shiptocompany}
          onChange={handleChange}
          errorMsg={serverErrors?.shiptocompany}
        />

        {/* First Name */}
        <Input
          label="First Name"
          id="shiptofirstName"
          type="text"
          required
          value={formData.shiptofirstName}
          onChange={handleChange}
          errorMsg={serverErrors?.shiptofirstName}
        />

        {/* Last Name */}
        <Input
          label="Last Name"
          id="shiptolastName"
          type="text"
          required
          value={formData.shiptolastName}
          onChange={handleChange}
          errorMsg={serverErrors?.shiptolastName}
        />

        {/* Email Address */}
        <Input
          label="Email Address"
          id="shiptoemail"
          type="email"
          required
          value={formData.shiptoemail}
          onChange={handleChange}
          errorMsg={serverErrors?.shiptoemail}
        />

        {/* Phone Number */}
        <Input
          label="Phone Number"
          id="shiptophoneNumber"
          type="tel"
          required
          pattern="[0-9]{10}" // Assuming 10-digit phone number
          value={formData.shiptophoneNumber}
          onChange={handleChange}
          errorMsg={serverErrors?.shiptophoneNumber}
        />

        {/* Address Line 1 */}
        <Input
          label="Address Line 1"
          id="shiptoaddressLine1"
          type="text"
          required
          value={formData.shiptoaddressLine1}
          onChange={handleChange}
          errorMsg={serverErrors?.shiptoaddressLine1}
        />

        {/* Address Line 2 */}
        <Input
          label="Address Line 2"
          id="shiptoaddressLine2"
          type="text"
          required
          value={formData.shiptoaddressLine2}
          onChange={handleChange}
          errorMsg={serverErrors?.shiptoaddressLine2}
        />

        {/* Locality */}
        <Input
          label="Locality"
          id="shiptolocality"
          type="text"
          required
          value={formData.shiptolocality}
          onChange={handleChange}
          errorMsg={serverErrors?.shiptolocality}
        />

        {/* Pincode */}
        <Input
          label="Pincode"
          id="shiptopincode"
          type="text"
          required
          pattern="[0-9]{6}" // Assuming 6-digit pincode
          value={formData.shiptopincode}
          onChange={handleChange}
          errorMsg={serverErrors?.shiptopincode}
        />

        {/* City */}
        <Input
          label="City"
          id="shiptocity"
          type="text"
          required
          value={formData.shiptocity}
          onChange={handleChange}
          errorMsg={serverErrors?.shiptocity}
        />

        {/* State */}
        {/* Assuming a text input for the state; replace with a Select if needed */}
        {/* <Input
          label="State"
          id="state"
          type="select"
          required
          value={formData.state}
          options={[
            { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
            // Add other states as options
          ]}
          onChange={handleChange}
          errorMsg={serverErrors?.state}
        /> */}

        {/* Checkbox for updating the address book */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="updateAddress"
            checked={formData.updateAddress}
            onChange={handleChange}
          />
          <label htmlFor="updateAddress">Update address to address book</label>
        </div>

        {/* Submit Button */}
        <SubmitButton text="Continue" submittingText="Processing..." />
      </div>
    </form>
  );
}
