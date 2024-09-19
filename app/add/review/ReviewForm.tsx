"use client";

import { useState } from "react";
import Input from "@/components/Input";
import SubmitButton from "@/components/SubmitButton";
// import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateShipmentForm() {
  // const router = useRouter();
  const [shipmentData, setShipmentData] = useState({
    shipmentType: "Forward",
    packageType: "Package",
    totalPackages: "1",
    totalActualWeight: "5 Kgs",
    generalDescription: "test",
    valueOfGoods: "INR 0.00",
    specialInstructions: "test",
    shipmentDate: "02/09/2024",
    shipFrom: {
      name: "ashok shetty",
      address: "g noida, greater Uttar Pradesh ,201306",
      city: "greater",
      state: "Noida",
      pincode: "201306",
      email: "ashokshettymovin@gmail.com",
      phone: "9999190124",
    },
    shipTo: {
      name: "catch ccvvb",
      address: "12344, 2344, 445",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301",
      email: "test@gdfg.com",
      phone: "8575566666",
    },
  });

  const [selectedService, setSelectedService] = useState("");
  // const [promoCode, setPromoCode] = useState("");
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your submission logic here
    toast.success("Shipment created successfully");
    // router.push('/shipments'); // Redirect to shipments page after successful creation
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold">CREATE SHIPMENT</h1>
      <p>Here you go!</p>

      {/* Shipment Information */}
      <div className="bg-blue-950 p-4 rounded">
        <h2 className="font-semibold mb-2">Shipment Information</h2>
        <p>Shipment Type: {shipmentData.shipmentType}</p>
        <p>Package Type: {shipmentData.packageType}</p>
        <p>Total No of Packages: {shipmentData.totalPackages}</p>
        <p>Total Actual Weight: {shipmentData.totalActualWeight}</p>
        <p>General Description: {shipmentData.generalDescription}</p>
        <p>Value of Goods: {shipmentData.valueOfGoods}</p>
      </div>

      {/* Ship From */}
      <div className="bg-blue-950 p-4 rounded">
        <h2 className="font-semibold mb-2">Ship From</h2>
        <p>{shipmentData.shipFrom.name}</p>
        <p>{shipmentData.shipFrom.address}</p>
        <p>
          {shipmentData.shipFrom.city}, {shipmentData.shipFrom.state},{" "}
          {shipmentData.shipFrom.pincode}
        </p>
        <p>Email: {shipmentData.shipFrom.email}</p>
        <p>Phone: {shipmentData.shipFrom.phone}</p>
      </div>

      {/* Ship To */}
      <div className="bg-blue-950 p-4 rounded">
        <h2 className="font-semibold mb-2">Ship To</h2>
        <p>{shipmentData.shipTo.name}</p>
        <p>{shipmentData.shipTo.address}</p>
        <p>
          {shipmentData.shipTo.city}, {shipmentData.shipTo.state},{" "}
          {shipmentData.shipTo.pincode}
        </p>
        <p>Email: {shipmentData.shipTo.email}</p>
        <p>Phone: {shipmentData.shipTo.phone}</p>
      </div>

      {/* Special Instructions */}
      <div className="bg-blue-950 p-4 rounded">
        <h2 className="font-semibold mb-2">Special Instructions</h2>
        <p>{shipmentData.specialInstructions}</p>
      </div>

      {/* Shipment Date */}
      <div>
        <label htmlFor="shipmentDate">Shipment Date</label>
        <Input
          label="shipment date"
          id="valueOfGoods"
          type="date"
          value={shipmentData.shipmentDate}
          onChange={(e) =>
            setShipmentData({ ...shipmentData, shipmentDate: e.target.value })
          }
        />
      </div>

      {/* Service Selection */}
      <div>
        <h2 className="font-semibold mb-2">Select one of the services</h2>
        <div className="flex gap-4">
          <button
            type="button"
            className={`p-2 border rounded ${
              selectedService === "express" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setSelectedService("express")}
          >
            Express End of Day
            <p>Shipment Date: 03 Sep, 2024</p>
            <p>Delivery Date & Time: 04 Sep, 2024 11:30 PM</p>
          </button>
          <button
            type="button"
            className={`p-2 border rounded ${
              selectedService === "standard" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setSelectedService("standard")}
          >
            Standard Premium
            <p>Shipment Date: 03 Sep, 2024</p>
            <p>Delivery Date & Time: 04 Sep, 2024 11:30 PM</p>
          </button>
        </div>
      </div>

      {/* Promo Code */}
      {/* <div className="flex gap-2">
        <Input
          placeholder="Promo Code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div> */}

      {/* Agreement Checkbox */}
      <div>
        <input
          type="checkbox"
          id="agreePolicy"
          checked={agreeToPolicy}
          onChange={(e) => setAgreeToPolicy(e.target.checked)}
        />
        <label htmlFor="agreePolicy" className="ml-2">
          By proceeding to the payment, I am agreeing for the Refund and
          Cancellation policy.
        </label>
      </div>

      <SubmitButton text="Proceed to Payment" submittingText="Processing..." />
    </form>
  );
}
