type ShipmentDetails = {
  serviceType: "standard" | "express";
  weight: number; // in kg
  quantity: number; // number of packages
  valueOfGoods: number; // value of goods in INR
  distance: "local" | "domestic" | "international"; // distance zone
};

// Function to calculate price
function calculateShipmentPrice(details: ShipmentDetails): number {
  // Step 1: Define base prices for different services
  const basePrices = {
    standard: 50,
    express: 200,
  };

  // Step 2: Define weight-based surcharges
  const weightSurcharge = (weight: number): number => {
    if (weight <= 1) return 50;
    if (weight <= 5) return 100;
    if (weight <= 10) return 200;
    return 500; // weight above 10kg
  };

  // Step 3: Calculate extra costs for additional packages
  const quantitySurcharge =
    details.quantity > 1 ? (details.quantity - 1) * 3 : 0;

  // Step 4: Calculate handling costs based on the value of goods
  const valueSurcharge = (value: number): number => {
    if (value < 100) return 0;
    if (value <= 500) return 500;
    return 100;
  };

  // Step 5: Distance multiplier
  const distanceMultiplier = {
    local: 1.0,
    domestic: 1.2,
    international: 1.5,
  };

  // Step 6: Calculate the total price
  const basePrice = basePrices[details.serviceType];
  const totalPrice =
    basePrice +
    weightSurcharge(details.weight) +
    quantitySurcharge +
    valueSurcharge(details.valueOfGoods);

  // Apply distance multiplier
  const finalPrice = totalPrice * distanceMultiplier[details.distance];

  return finalPrice;
}

export default calculateShipmentPrice;

//   // Example usage:
//   const shipmentDetails: ShipmentDetails = {
//     serviceType: "express",
//     weight: 3, // 3kg
//     quantity: 2, // 2 packages
//     valueOfGoods: 200, // $200 worth of goods
//     distance: "domestic" // Domestic shipping
//   };

//   const price = calculateShipmentPrice(shipmentDetails);
//   console.log(`Total Shipment Price: $${price.toFixed(2)}`); // Total Shipment Price: $55.20
