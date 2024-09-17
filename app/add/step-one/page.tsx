import React from "react";
import StepOneForm from "./StepOneForm";

export default function StepOne() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Create Shipment - Step 1</h1>
      <StepOneForm />
    </div>
  );
}
