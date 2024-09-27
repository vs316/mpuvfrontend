"use client";
import { useEffect, useState } from "react";
import Input from "@/components/Input";
import SubmitButton from "../../../components/SubmitButton";
import { stepThreeFormAction } from "./actions";
import { FormErrors } from "@/types";
import { useFormState } from "react-dom";
import { NewDealInitialValuesType } from "@/schemas"; // Add this import
import { useAddDealContext } from "@/contexts/addDealContext";
import { useRouter } from "next/navigation";
import { AddRoutes } from "@/types";
const initialState: { errors?: FormErrors; success: boolean } = {
  success: false,
};

export default function StepThreeForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(stepThreeFormAction, initialState);
  const { newDealData, updateNewDealDetails } = useAddDealContext();
  // State for managing packages
  const [packages, setPackages] = useState(
    newDealData.packages?.map((pkg) => ({
      weight: String(pkg.weight || ""),
      valueofgoods: String(pkg.valueofgoods || ""),
      description: pkg.description || "",
      instructions: pkg.instructions || "",
    })) || [{ weight: "", valueofgoods: "", description: "", instructions: "" }]
  );
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Use useEffect to scroll to the top when the form loads
  useEffect(() => {
    handleScrollToTop();
  }, []);
  useEffect(() => {
    // Update context when packages change
    updateNewDealDetails({ packages });
  }, [packages, updateNewDealDetails]);

  useEffect(() => {
    if (state.success) {
      router.push(AddRoutes.REVIEW_INFO);
    }
  }, [state.success, router]);
  // Function to add a new package
  const addPackage = () => {
    setPackages([
      ...packages,
      { weight: "", valueofgoods: "", description: "", instructions: "" },
    ]);
  };

  // Function to update a package's details
  const updatePackage = (
    index: number,
    field: keyof NewDealInitialValuesType["packages"][number],
    value: string | number
  ) => {
    const updatedPackages = packages.map((pkg, i) =>
      i === index ? { ...pkg, [field]: String(value) } : pkg
    );
    //updatedPackages[index][field] = value;
    setPackages(updatedPackages);
  };
  // Function to remove a package
  const removePackage = (index: number) => {
    const updatedPackages = packages.filter((_, i) => i !== index);
    setPackages(updatedPackages);
  };

  // Store the updated package array in localStorage dynamically
  //   const allData = JSON.parse(
  //     localStorage.getItem("multi-page-form-demo-newDealData") || "{}"
  //   );
  //   localStorage.setItem(
  //     "multi-page-form-demo-newDealData",
  //     JSON.stringify({
  //       ...allData,
  //       packages: updatedPackages, // Store the array of packages
  //     })
  //   );
  // };

  // Handle form submit
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  // };

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        {/* General Description of Goods */}
        <Input
          label="General Description of Goods"
          id="descriptionOfGoods"
          type="text"
          required
          value={newDealData.descriptionOfGoods || ""}
          onChange={(e) =>
            updateNewDealDetails({ descriptionOfGoods: e.target.value })
          }
          errorMsg={
            state.errors?.descriptionOfGoods
              ? String(state.errors.descriptionOfGoods)
              : undefined
          }
        />

        {/* Render each package */}
        {packages?.map((pkg, index) => (
          <div key={index} className="border p-4 rounded-md bg-popover">
            <h3 className="font-bold">Package {index + 1}</h3>

            {/* Weight */}
            <Input
              label="Weight (in Kgs)"
              id={`weight-${index}` as keyof NewDealInitialValuesType}
              type="number"
              value={pkg.weight}
              onChange={(e) => updatePackage(index, "weight", e.target.value)}
              required
              errorMsg={
                state.errors?.[`weight-${index}`]
                  ? String(state.errors[`weight-${index}`])
                  : undefined
              }
            />

            <Input
              label="Value"
              id={`valueofgoods-${index}` as keyof NewDealInitialValuesType}
              type="number"
              value={pkg.valueofgoods}
              onChange={(e) =>
                updatePackage(index, "valueofgoods", e.target.value)
              }
              required
              errorMsg={
                state.errors?.[`valueofgoods-${index}`]
                  ? String(state.errors[`valueofgoods-${index}`])
                  : undefined
              }
            />
            {/* Package Description */}
            <Input
              label="Package Description"
              id={`description-${index}` as keyof NewDealInitialValuesType}
              type="text"
              value={pkg.description}
              onChange={(e) =>
                updatePackage(index, "description", e.target.value)
              }
              required
              errorMsg={
                state.errors?.[`description-${index}`]
                  ? String(state.errors[`description-${index}`])
                  : undefined
              }
            />
            {/* Package Instructions */}
            <Input
              label="Package Instructions"
              id={`instructions-${index}` as keyof NewDealInitialValuesType}
              type="text"
              value={pkg.instructions}
              onChange={(e) =>
                updatePackage(index, "instructions", e.target.value)
              }
              errorMsg={
                state.errors?.[`instructions-${index}`]
                  ? String(state.errors[`instructions-${index}`])
                  : undefined
              }
            />
            {/* Button to remove this package */}
            <button
              type="button"
              className="mt-2 text-red-500"
              onClick={() => removePackage(index)}
            >
              Remove Package
            </button>
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
        <SubmitButton text="Continue" submittingText="Processing..." />
      </div>
    </form>
  );
}
