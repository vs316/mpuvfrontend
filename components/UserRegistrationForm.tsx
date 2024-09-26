"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "./ui/progress";
import { PasswordStrengthVisualizer } from "./ui/passwordstrengthvisualizer";
import { useUser } from "@/contexts/userContext";
import { getOrCreateUserId } from "@/app/utils/UserUtils";
//import { useRouter } from "next/router";
interface Address {
  address_id?: number;
  address_line_1: string;
  address_line_2?: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
  uuid?: string;
}

interface UserRegistration {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  addresses: Address[];
  emailVerified: boolean;
  phoneVerified: boolean;
}

function SignupForm() {
  const userId = getOrCreateUserId();
  console.log(userId);
  const { toast } = useToast();
  const userContext = useUser();
  if (!userContext) {
    throw new Error("User context is not available");
  }
  const [formData, setFormData] = useState<UserRegistration>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    addresses: [{ address_line_1: "", city: "", state: "", pincode: "" }],
    emailVerified: false,
    phoneVerified: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  // const [loading, setLoading] = useState(false);
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25; // Length
    if (/[A-Z]/.test(password)) strength += 25; // Uppercase
    if (/[0-9]/.test(password)) strength += 25; // Number
    if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Special character
    return strength;
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };
  const handleAddressChange = async (
    index: number,
    field: keyof Address,
    value: string
  ) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };

    if (field === "pincode" && value.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Directly parse JSON response
        // Check for valid response structure
        if (
          Array.isArray(data) &&
          data[0]?.Status === "Success" &&
          Array.isArray(data[0]?.PostOffice) &&
          data[0].PostOffice.length > 0
        ) {
          const postOffice = data[0].PostOffice[0];
          // Update city and state in the address
          newAddresses[index].city = postOffice.Name;
          newAddresses[index].state = postOffice.State;
        } else {
          console.warn("Pincode not found or invalid data structure");
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error);
      }
    }

    // Update the form data state with the new address
    setFormData({ ...formData, addresses: newAddresses });
  };
  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        { address_line_1: "", city: "", state: "", pincode: "" },
      ],
    });
  };

  const removeAddress = (index: number) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    //setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: userId,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone_number,
          password: formData.password,
          addresses: formData.addresses,
        }),
      });
      //  const responseText = await response.text(); // Get the raw response text

      if (response.ok) {
        toast({
          title: "Success",
          description: "Signup successful!",
          variant: "default",
        });
      }
      // const data = JSON.parse(responseText); // Parse the JSON response
      // console.log("Response data:", data);

      // // Fetch the new user ID
      // const userIdResponse = await fetch(
      //   `http://localhost:3000/user/${data.user_id}`
      // );
      // if (userIdResponse.ok) {
      //   const userIdData = await userIdResponse.json();
      //   const userId = userIdData.user_id; // Store the user ID for future reference
      //   console.log("New User ID:", userId);
      // }

      // const addressIdResponse = await fetch(
      //   `http://localhost:3000/address?uuid=${userId}`
      // );
      // if (addressIdResponse.ok) {
      //   const addressIdData: {
      //     status: string;
      //     message: string;
      //     result: Address[];
      //   } = await addressIdResponse.json();
      //   const filteredAddresses = addressIdData.result.filter(
      //     (address) => address.uuid ===userId
      //   );
      //   const addressId = filteredAddresses.address_id;
      //   console.log("New address ID:", addressId);
      //   if (filteredAddresses.length > 0) {
      //     const addressId = filteredAddresses[0].address_id; // Get the address_id of the first matching address
      //     console.log("New address ID:", addressId);
      //   } else {
      //     console.log("No addresses found for this user ID.");
      //   }
      // } else {
      //   console.error(
      //     "Failed to fetch addresses:",
      //     addressIdResponse.statusText
      //   );
      //     }}
      else {
        const errorData = await response.json();
        console.error("Signup error:", errorData); // Log the raw error response // Attempt to parse the error response
        toast({
          title: "Error",
          description: errorData.message || "An error occurred during signup.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        title: "Error",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    }
  };
  //   finally {
  //     setLoading(false);
  //   }
  // };
  const calculateCompletionPercentage = () => {
    const totalFields = 6 + formData.addresses.length * 5; // 6 fields + 5 fields per address
    let filledFields = 0;

    if (formData.first_name) filledFields++;
    if (formData.last_name) filledFields++;
    if (formData.email) filledFields++;
    if (formData.phone_number) filledFields++;
    if (formData.password) filledFields++;
    if (confirmPassword) filledFields++;

    formData.addresses.forEach((address) => {
      if (address.address_line_1) filledFields++;
      if (address.city) filledFields++;
      if (address.state) filledFields++;
      if (address.pincode) filledFields++;
    });

    return (filledFields / totalFields) * 100;
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      {/* Render ProgressBar */}
      <div className="flex flex-col p-6 space-y-1">
        <h3 className="font-semibold tracking-tight text-2xl">
          Create an account
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <div className="p-6 pt-0 grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="firstName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              First Name
            </Label>
            <Input
              type="text"
              id="firstName"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div>
            <Label
              htmlFor="lastName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Last Name
            </Label>
            <Input
              type="text"
              id="lastName"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </Label>
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <br />
        </div>
        <div>
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Phone Number
          </Label>
          <Input
            type="tel"
            id="phoneNumber"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <br />
          <Progress value={calculateCompletionPercentage()} />{" "}
        </div>
        {formData.addresses.map((address, index) => (
          <div
            key={index}
            className="space-y-2 bg-muted/50 text-muted-foreground p-4 rounded-md relative"
          >
            <h3 className="text-lg font-semibold">Address {index + 1}</h3>
            <Button
              type="button"
              onClick={() => removeAddress(index)}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground"
              size="sm"
            >
              Remove
            </Button>
            <div>
              <Label
                htmlFor={`address_line_1-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Street Address
              </Label>
              <Input
                type="text"
                id={`address_line_1-${index}`}
                value={address.address_line_1}
                onChange={(e) =>
                  handleAddressChange(index, "address_line_1", e.target.value)
                }
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <Label
                htmlFor={`address_line_2-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Address Line 2
              </Label>
              <Input
                type="text"
                id={`address_line_2-${index}`}
                value={address.address_line_2 || ""}
                onChange={(e) =>
                  handleAddressChange(index, "address_line_2", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <Label
                htmlFor={`locality-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Locality
              </Label>
              <Input
                type="text"
                id={`locality-${index}`}
                value={address.locality || ""}
                onChange={(e) =>
                  handleAddressChange(index, "locality", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor={`pincode-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Pincode
                </Label>
                <Input
                  type="number"
                  id={`pincode-${index}`}
                  value={address.pincode}
                  onChange={(e) =>
                    handleAddressChange(index, "pincode", e.target.value)
                  }
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div>
                <Label
                  htmlFor={`city-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  City
                </Label>
                <Input
                  type="text"
                  id={`city-${index}`}
                  value={address.city}
                  onChange={(e) =>
                    handleAddressChange(index, "city", e.target.value)
                  }
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor={`state-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                State
              </Label>
              <Input
                type="text"
                id={`state-${index}`}
                value={address.state}
                onChange={(e) =>
                  handleAddressChange(index, "state", e.target.value)
                }
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          onClick={addAddress}
          className="mt-2 w-full"
          variant="default"
        >
          Add Another Address
        </Button>

        <div>
          <Label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Password
          </Label>
          <Input
            type="password"
            id="password"
            value={formData.password}
            onChange={handlePasswordChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <PasswordStrengthVisualizer
            value={passwordStrength}
            className="mt-2"
          />
        </div>

        <div>
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Confirm Password
          </Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex items-center pt-6">
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </div>
      </div>
    </form>
  );
}

export default SignupForm;
