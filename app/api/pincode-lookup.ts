import type { NextApiRequest, NextApiResponse } from "next";

type PincodeData = {
  city: string;
  district: string;
  state: string;
  deliveryStatus: string;
  branchType: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PincodeData | { error: string }>
) {
  const { pincode } = req.query;

  if (!pincode || typeof pincode !== "string" || !/^\d{6}$/.test(pincode)) {
    return res
      .status(400)
      .json({ error: "Invalid pincode. Must be a 6-digit number." });
  }

  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawText = await response.text();
    console.log("Raw API response:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return res.status(500).json({ error: "Invalid JSON response from API" });
    }

    if (
      Array.isArray(data) &&
      data[0]?.Status === "Success" &&
      data[0]?.PostOffice &&
      data[0]?.PostOffice.length > 0
    ) {
      const postOffice = data[0].PostOffice[0];
      res.status(200).json({
        city: postOffice.Name,
        district: postOffice.District,
        state: postOffice.State,
        deliveryStatus: postOffice.DeliveryStatus,
        branchType: postOffice.BranchType,
      });
    } else {
      res
        .status(404)
        .json({ error: "Pincode not found or invalid data structure" });
    }
  } catch (error) {
    console.error("Error fetching pincode data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
