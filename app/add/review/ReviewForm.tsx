"use client";

import { useState, useEffect } from "react";
import SubmitButton from "@/components/SubmitButton";
import toast from "react-hot-toast";
import { useAddDealContext } from "@/contexts/addDealContext"; // Import the context
// import { NewDealType } from "@/schemas";
// import { submitDealAction } from "./actions";
//import { useRouter } from "next/router";
import calculateShipmentPrice from "@/lib/calculatePricealgo";
import { getOrCreateUserId } from "@/app/utils/UserUtils";

type ShipmentDetails = {
  serviceType: "standard" | "express";
  weight: number; // in kg
  quantity: number; // number of packages
  valueOfGoods: number; // value of goods in INR
  distance: "local" | "domestic" | "international"; // distance zone
};

export default function CreateShipmentForm() {
  const { newDealData, updateNewDealDetails } = useAddDealContext(); // Get the newDealData from context
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  //const router = useRouter();
  const [uuid, setUserId] = useState("");

  // Load data from localStorage on component mount
  useEffect(() => {
    const userIdFromStorage = getOrCreateUserId();
    setUserId(userIdFromStorage);
  }, []);
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Use useEffect to scroll to the top when the form loads
  useEffect(() => {
    handleScrollToTop();
  }, []);
  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem("multi-page-form-demo-newDealData") || "{}"
    );
    const storedService = localStorage.getItem("selectedService");
    if (storedService) {
      setSelectedService(storedService);
    }
    // Dynamically extract package data from localStorage based on the keys
    const extractedPackages = [];
    let index = 0;

    while (storedData[`weight-${index}`]) {
      extractedPackages.push({
        weight: storedData[`weight-${index}`] || "N/A",
        valueofgoods: storedData[`valueofgoods-${index}`] || "N/A",
        description: storedData[`description-${index}`] || "N/A",
        instructions: storedData[`instructions-${index}`] || "None",
      });
      index++;
    }

    // Update the context or state with the extracted package data
    updateNewDealDetails({
      ...storedData,
      packages: extractedPackages,
    });
  }, [updateNewDealDetails]);

  // Handle shipment service selection and update in localStorage
  const handleServiceSelection = (service: string) => {
    setSelectedService(service);
    localStorage.setItem("selectedService", service);

    // Optionally, store in context if needed for the review page
    // updateNewDealDetails({ selectedService: service });
  };
  const getUserIdByUuid = async (uuid: string): Promise<number | null> => {
    try {
      const response = await fetch(`http://localhost:3000/user/${uuid}`);
      if (!response.ok) {
        console.error("Failed to fetch user ID");
        return null;
      }
      const data = await response.json();
      return data.user_id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Retrieve data from localStorage
    const localData = JSON.parse(
      localStorage.getItem("multi-page-form-demo-newDealData") || "{}"
    );
    const storedService = localStorage.getItem("selectedService");

    // Get current user's UUID (you'll need to implement this based on your auth system)
    const currentUserUuid = uuid; // Replace with actual UUID from your auth system

    // Fetch user_id using UUID
    const userId = await getUserIdByUuid(currentUserUuid);
    if (!userId) {
      toast.error("Failed to identify user");
      return;
    }

    // Calculate shipment price
    const shipmentDetails: ShipmentDetails = {
      serviceType: selectedService as "standard" | "express",
      weight: parseFloat(String(newDealData.packages[0]?.weight || 0)),
      quantity: newDealData.packages.length,
      valueOfGoods: parseFloat(
        String(newDealData.packages[0]?.valueofgoods || 0)
      ),
      distance: "domestic",
    };
    const shipmentPrice = calculateShipmentPrice(shipmentDetails);
    localStorage.setItem("shipmentPrice", String(shipmentPrice));

    // Prepare shipment data according to the API format
    const shipmentRequestData = {
      userId: userId,
      shipmentData: {
        shipment_type: storedService?.toUpperCase() || "STANDARD",
        status: "PENDING",
        shipFromDetails: {
          first_name: localData.firstName,
          last_name: localData.lastName,
          email: localData.email,
          phone_number: localData.phoneNumber,
          address_line_1: localData.addressLine1,
          address_line_2: localData.addressLine2 || null,
          city: localData.city,
          pincode: localData.pincode,
          locality: localData.locality || null,
        },
        shipToDetails: {
          first_name: localData.shiptofirstName,
          last_name: localData.shiptolastName,
          email: localData.shiptoemail,
          phone_number: localData.shiptophoneNumber,
          address_line_1: localData.shiptoaddressLine1,
          address_line_2: localData.shiptoaddressLine2 || null,
          city: localData.shiptocity,
          pincode: localData.shiptopincode,
          locality: localData.shiptolocality || null,
          company: localData.shiptocompany || null,
        },
        paymentDetails: {
          amount: shipmentPrice,
          payment_method: "CARD",
          payment_status: "PENDING",
        },
        shipmentItems: localData.packages.map(
          (packageItem: {
            description: string;
            weight: string;
            valueofgoods: string;
            //instructions?: string;
            descriptionOfGoods: string;
          }) => ({
            item_description: packageItem.description,
            quantity: 1,
            weight: parseFloat(packageItem.weight),
            value: parseFloat(packageItem.valueofgoods),
            servicetype: storedService?.toUpperCase() || "STANDARD",
            descriptionOfGoods: packageItem.descriptionOfGoods,
            // special_instructions: packageItem.instructions || null,
          })
        ),
      },
    };

    try {
      const response = await fetch("http://localhost:3000/shipments/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipmentRequestData),
      });

      if (response.ok) {
        const shipmentResponse = await response.json();
        console.log("Shipment created successfully:", shipmentResponse);
        toast.success("Order submitted successfully");
        const paymentResponse = await fetch(
          "http://localhost:3000/payment/latest",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // resetLocalStorage();
        // localStorage.removeItem("selectedService");
        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          const paymentId = paymentData.payment_id; // Adjust according to your API response structure
          localStorage.setItem("paymentId", paymentId); // Store payment ID in local storage
        }
        window.location.href = "http://localhost:3001/payment";
      } else {
        const errorData = await response.json();
        console.error("Error creating shipment:", errorData);
        toast.error(errorData.message || "Failed to create shipment");
      }
    } catch (error) {
      console.error("Error posting shipment data:", error);
      toast.error("Failed to submit shipment");
    }
  };
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   // Step 1: Retrieve data from localStorage
  //   const localData = JSON.parse(
  //     localStorage.getItem("multi-page-form-demo-newDealData") || "{}"
  //   );
  //   const storedService = localStorage.getItem("selectedService");
  //   // Step 2: Prepare the data for each API request

  //   // Ship From data
  //   const shipFromData = {
  //     first_name: localData.firstName,
  //     last_name: localData.lastName,
  //     email: localData.email,
  //     phone_number: localData.phoneNumber,
  //     pincode: localData.pincode,
  //     city: localData.city,
  //     locality: localData.locality,
  //     address_line_2: localData.addressLine2,
  //     address_line_1: localData.addressLine1,
  //   };

  //   // Ship To data
  //   const shipToData = {
  //     company: localData.shiptocompany,
  //     first_name: localData.shiptofirstName,
  //     last_name: localData.shiptolastName,
  //     email: localData.shiptoemail,
  //     phone_number: localData.shiptophoneNumber,
  //     pincode: localData.shiptopincode,
  //     city: localData.shiptocity,
  //     locality: localData.shiptolocality,
  //     address_line_2: localData.shiptoaddressLine2,
  //     address_line_1: localData.shiptoaddressLine1,
  //   };

  //   // Shipment Item (Package) data
  //   const shipmentItemData = localData.packages.map(
  //     (packageItem: {
  //       description: string;
  //       weight: string;
  //       valueofgoods: string;
  //     }) => ({
  //       item_description: packageItem.description || null,
  //       weight: parseFloat(packageItem.weight) || null,
  //       value: parseFloat(packageItem.valueofgoods) || null,
  //       descriptionOfGoods: localData.descriptionOfGoods || null,
  //       servicetype: storedService,
  //     })
  //   );

  //   // Retrieve the relevant data for price calculation
  //   const shipmentDetails: ShipmentDetails = {
  //     serviceType: selectedService as "standard" | "express",
  //     // Use String() to ensure a string value for parseFloat
  //     weight: parseFloat(String(newDealData.packages[0]?.weight || 0)),
  //     quantity: newDealData.packages.length,
  //     valueOfGoods: parseFloat(
  //       String(newDealData.packages[0]?.valueofgoods || 0)
  //     ),
  //     distance: "domestic", // For now, use a static value or calculate based on addresses
  //   };

  //   const shipmentPrice = calculateShipmentPrice(shipmentDetails);

  //   console.log(`Calculated Shipment Price: Rs${shipmentPrice}`);
  //   localStorage.setItem("shipmentPrice", String(shipmentPrice));
  //   window.location.href = "http://localhost:3001/payment";
  //   // Step 3: Send the API requests asynchronously
  //   try {
  //     const [shipFromResponse, shipToResponse] = await Promise.all([
  //       fetch("http://localhost:3000/shipfrom", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(shipFromData),
  //       }),
  //       fetch("http://localhost:3000/shipto", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(shipToData),
  //       }),
  //     ]);
  //     const shipmentItemResponse = await Promise.all(
  //       shipmentItemData.map(
  //         (shipmentItem: {
  //           item_description: string | null;
  //           weight: number | null;
  //           value: number | null;
  //           descriptionOfGoods: string | null;
  //           servicetype: string | null;
  //         }) =>
  //           fetch("http://localhost:3000/shipment-items", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(shipmentItem),
  //           })
  //       )
  //     );

  //     // Check for successful responses
  //     if (
  //       shipFromResponse.ok &&
  //       shipToResponse.ok &&
  //       shipmentItemResponse.every((response) => response.ok)
  //     ) {
  //       console.log("All API requests succeeded");

  //       // Step 4: Redirect to payment gateway page
  //       // router.push("/payment"); // Use the router to navigate to the payment page
  //     } else {
  //       console.error("Error occurred in one or more API requests");
  //     }
  //   } catch (error) {
  //     console.error("Error posting data:", error);
  //   }

  //   const res = await submitDealAction(newDealData as NewDealType);
  //   const { errorMsg, success } = res;

  //   if (success) {
  //     toast.success("Order submitted successfully");
  //     resetLocalStorage();
  //     localStorage.removeItem("selectedService");
  //   } else if (errorMsg) {
  //     toast.error(errorMsg);
  //   }
  // };
  // Post the relevant data to the backend
  //   try {
  //     const response = await fetch("http://localhost:3000/shipmentservice", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         ...newDealData,
  //         selectedService,
  //         agreeToPolicy,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to create shipment");
  //     }

  //     toast.success("Shipment created successfully");
  //     // Optionally redirect after successful submission
  //     // router.push('/shipments');
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       toast.error(error.message);
  //     } else {
  //       toast.error("An unexpected error occurred");
  //     }
  //   }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold">Order Summary</h1>
      <p>Please review the details carefully before proceeding to payment!</p>

      {/* Shipment Information */}
      <div className="bg-blue-950 p-4 rounded">
        <h2 className="font-semibold mb-2">Shipment Information</h2>
        <p>
          Description of Goods:{" "}
          {newDealData?.descriptionOfGoods || "Not provided"}
        </p>
        {/* Loop through the array of packages and display each one */}
        {newDealData?.packages?.map((pkg, index) => (
          <div key={index}>
            <h3>Package {index + 1}</h3>
            <p>Weight: {pkg.weight || "N/A"}</p>
            <p>Value: {pkg.valueofgoods || "N/A"}</p>
            <p>Description: {pkg.description || "N/A"}</p>
            <p>Instructions: {pkg.instructions || "None"}</p>
          </div>
        ))}
      </div>

      {/* Ship From */}
      <div className="bg-blue-950 p-4 rounded">
        <h2 className="font-semibold mb-2">Ship From</h2>
        <p>
          {newDealData.firstName} {newDealData.lastName}
        </p>
        <p>
          {newDealData.addressLine1}, {newDealData.addressLine2}
        </p>
        <p>
          {newDealData.city}, {newDealData.locality}, {newDealData.pincode}
        </p>
        <p>Email: {newDealData.email}</p>
        <p>Phone: {newDealData.phoneNumber}</p>
      </div>

      {/* Ship To */}
      <div className="bg-blue-950 p-4 rounded">
        <h2 className="font-semibold mb-2">Ship To</h2>
        <p>{newDealData.shiptocompany}</p>
        <p>
          {newDealData.shiptofirstName} {newDealData.shiptolastName}
        </p>
        <p>
          {newDealData.shiptoaddressLine1}, {newDealData.shiptoaddressLine2}
        </p>
        <p>
          {newDealData.shiptocity}, {newDealData.shiptolocality},{" "}
          {newDealData.shiptopincode}
        </p>
        <p>Email: {newDealData.shiptoemail}</p>
        <p>Phone: {newDealData.shiptophoneNumber}</p>
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
            onClick={() => handleServiceSelection("express")}
          >
            Express [End of Day]
          </button>
          <button
            type="button"
            className={`p-2 border rounded ${
              selectedService === "standard" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => handleServiceSelection("standard")}
          >
            Standard Premium [3-6 business days]
          </button>
        </div>
      </div>

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

      {/* Submit Button */}
      <SubmitButton
        text="Proceed to Payment"
        submittingText="Processing..."
        disabled={!selectedService || !agreeToPolicy}
      />
    </form>
  );
}
