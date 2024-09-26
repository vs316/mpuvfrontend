// API utility functions for making HTTP requests
interface Address {
  addressLine1?: string;
  addressLine2?: string; // Optional field
  locality?: string; // Optional field
  city?: string;
  state?: string;
  pincode?: string;
  uuid?: string;
}
interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  user_id: number;
}

interface shipfrom {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  addressLine1?: string;
  addressLine2?: string; // Optional field
  locality?: string; // Optional field
  city?: string;
  pincode?: string;
}
// export async function getUser(userId: number) {
//   try {
//     const response = await fetch(`http://localhost:3000/user/${userId}`); // Assuming you have an API route at /api/users/[id]
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     throw error; // Re-throw the error to be handled by the caller
//   }
// }
export async function getUserAddresses(userId: number) {
  try {
    // Fetching addresses for the specified userId
    const response = await fetch(
      `http://localhost:3000/address?userId=${userId}`
    ); // Adjusted to use query parameters

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Check if the response contains addresses
    if (data.result && data.result.length > 0) {
      return data.result; // Return only the addresses
    } else {
      return []; // Return an empty array if no addresses found
    }
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw error;
  }
}

export async function postNewAddress(uuid: string, newAddress: Address) {
  try {
    const response = await fetch(`http://localhost:3000/address?uuid=${uuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newAddress,
        uuid, // Include userId in the request body
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save the new address");
    }

    // Parse the response
    const addresses = await response.json();

    // Filter the response to return only the newly created address
    const createdAddress = addresses.find(
      (address: Address) => address.uuid === uuid
    );

    // If the created address is not found, throw an error
    if (!createdAddress) {
      throw new Error("The newly created address was not found.");
    }

    return createdAddress;
  } catch (error) {
    console.error("Error posting new address:", error);
    throw error;
  }
}

export const getUserByEmail = async (email: string) => {
  const response = await fetch(`http://localhost:3000/user?email=${email}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }
  const data = await response.json();
  const userData = data.find((user: User) => user.email === email);
  console.log(userData);
  return userData;
};

export async function postShipFromDetails(shipFromData: shipfrom) {
  try {
    const response = await fetch("http://localhost:3000/shipfrom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipFromData),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to post ship-from details: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Ship-from details posted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error posting ship-from details:", error);
    throw error;
  }
}
