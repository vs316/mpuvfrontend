"use client";
import { useState } from "react";
import Input from "@/components/Input";
import SubmitButton from "../../../components/SubmitButton";
import { stepThreeFormAction } from "./actions";
import { FormErrors } from "@/types";
import { useFormState } from "react-dom";
//import Select from "@/components/Select"; // Assuming Select component for dropdown

const initialState: FormErrors = {};

export default function StepThreeForm() {
  const [serverErrors, formAction] = useFormState(
    stepThreeFormAction,
    initialState
  );

  // State for managing packages
  const [packages, setPackages] = useState([
    { weight: "", description: "", instructions: "" },
  ]);

  // Function to add a new package
  const addPackage = () => {
    setPackages([
      ...packages,
      { weight: "", description: "", instructions: "" },
    ]);
  };

  // Function to update a package's details
  const updatePackage = (index: number, field: string, value: string) => {
    const newPackages = [...packages];
    newPackages[index][field] = value;
    setPackages(newPackages);
  };

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        {/* Package Type */}
        {/* <Select
          label="Package Type"
          id="packageType"
          required
          options={[
            { value: "Package", label: "Package" },
            { value: "Document", label: "Document" },
          ]}
          errorMsg={serverErrors?.packageType}
        /> */}

        {/* Invoice Number */}
        {/* <Input
          label="Invoice Number"
          id="invoiceNumber"
          type="text"
          required
          errorMsg={serverErrors?.invoiceNumber}
        /> */}

        {/* Reference Number 1 */}
        {/* <Input
          label="Reference Number 1"
          id="referenceNumber1"
          type="text"
          required
          errorMsg={serverErrors?.referenceNumber1}
        /> */}

        {/* Reference Number 2 */}
        {/* <Input
          label="Reference Number 2"
          id="referenceNumber2"
          type="text"
          errorMsg={serverErrors?.referenceNumber2}
        /> */}

        {/* General Description of Goods */}
        <Input
          label="General Description of Goods"
          id="descriptionOfGoods"
          type="text"
          required
          errorMsg={serverErrors?.descriptionOfGoods}
        />

        {/* Value of Goods */}
        <Input
          label="Value of Goods"
          id="valueOfGoods"
          type="number"
          errorMsg={serverErrors?.valueOfGoods}
        />

        {/* Render each package */}
        {packages.map((pkg, index) => (
          <div key={index} className="border p-4 rounded-md bg-popover">
            <h3 className="font-bold">Package {index + 1}</h3>

            {/* Weight */}
            <Input
              label="Weight (in Kgs)"
              id={`weight-${index}`}
              type="number"
              value={pkg.weight}
              onChange={(e) => updatePackage(index, "weight", e.target.value)}
              required
              errorMsg={serverErrors?.[`weight-${index}`]}
            />

            {/* Package Description */}
            <Input
              label="Package Description"
              id={`description-${index}`}
              type="text"
              value={pkg.description}
              onChange={(e) =>
                updatePackage(index, "description", e.target.value)
              }
              required
              errorMsg={serverErrors?.[`description-${index}`]}
            />

            {/* Package Instructions */}
            <Input
              label="Package Instructions"
              id={`instructions-${index}`}
              type="text"
              value={pkg.instructions}
              onChange={(e) =>
                updatePackage(index, "instructions", e.target.value)
              }
              errorMsg={serverErrors?.[`instructions-${index}`]}
            />
          </div>
        ))}

        {/* Button to add another package */}
        <button
          type="button"
          className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md"
          onClick={addPackage}
        >
          + Add Package
        </button>

        {/* Value Added Services */}
        <div className="flex flex-col gap-2">
          <label>Value Added Services</label>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="emailNotification" />
            <label htmlFor="emailNotification">
              I would like to receive email notification about the shipment.
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="mobileNotification" />
            <label htmlFor="mobileNotification">
              I would like to receive mobile notification about the shipment.
            </label>
          </div>
        </div>

        {/* Cost Affecting Factors */}
        <div className="flex flex-col">
          <label>Cost Affecting Factors</label>
          <p>
            There are no additional cost affecting factors with this shipment.
            *This is subject to be revised on billing based on shipment
            characteristics changes if any.
          </p>
        </div>

        {/* Submit Button */}
        <SubmitButton text="Continue" />
      </div>
    </form>
  );
}
