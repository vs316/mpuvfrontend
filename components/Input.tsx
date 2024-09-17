"use client";

import { useAddDealContext } from "@/contexts/addDealContext";

interface InputProps {
  label: string;
  id: keyof NewDealData; // Ensure id is a key of NewDealData
  required?: boolean;
  pattern?: string;
  type: string;
  minLength?: number;
  min?: number;
  max?: number;
  errorMsg?: string;
  description?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface NewDealData {
  name?: string;
  link?: string;
  coupon?: string;
  discount?: number;
  contactName?: string;
  contactEmail?: string;
}

export default function Input({
  label,
  id,
  required,
  pattern,
  type,
  minLength,
  min,
  max,
  description,
  errorMsg,
}: InputProps) {
  const { updateNewDealDetails, newDealData } = useAddDealContext();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNewDealDetails({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <label className="block text-lg" htmlFor={id}>
        {label}
        {description && (
          <span className="text-sm text-slate-200 block mb-1">
            {description}
          </span>
        )}
      </label>
      <input
        className={`w-full rounded-md py-4 px-2 text-slate-400 ${
          errorMsg ? "border-red-500" : "border-slate-300"
        } border-2`}
        type={type}
        name={id}
        id={id}
        required={required}
        pattern={pattern}
        minLength={minLength}
        min={min}
        max={max}
        onChange={handleInputChange}
        defaultValue={newDealData[id]} // Now TypeScript knows id is a valid key
      />
      <div className="min-h-8 mt-1">
        {errorMsg && (
          <span className="text-red-500 text-sm block ">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
function setUpdatedDeal(arg0: (prev: any) => any) {
  throw new Error("Function not implemented.");
}
