"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";

interface IShipment {
  shipment_id: number;
  status: string;
  created_at: string;
  user: { first_name: string; last_name: string };
  payment: { amount: number }[];
  shipfrom: { city: string };
  shipto: { city: string };
}

const ShipmentTable: React.FC = () => {
  const [shipments, setShipments] = useState<IShipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserShipments = async () => {
      try {
        // Step 1: Retrieve the UUID from localStorage or sessionStorage
        const uuid = localStorage.getItem("user_id");
        if (!uuid) {
          console.error("UUID not found in localStorage or sessionStorage.");
          setLoading(false);
          return;
        }

        // Step 2: Fetch the user_id based on the UUID
        const userIdResponse = await fetch(
          `http://localhost:3000/user/id/${uuid}`
        );
        if (!userIdResponse.ok) {
          throw new Error("Failed to fetch user_id");
        }
        const { user_id } = await userIdResponse.json();

        // Step 3: Fetch shipments using the obtained user_id
        const shipmentsResponse = await fetch(
          `http://localhost:3000/shipments/user/${user_id}`
        );
        if (!shipmentsResponse.ok) {
          throw new Error("Failed to fetch shipments");
        }
        const shipmentsData = await shipmentsResponse.json();
        setShipments(shipmentsData);
      } catch (error) {
        console.error("Error fetching shipments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserShipments();
  }, []);

  return (
    <div style={{ marginTop: "80px" }}>
      <Table>
        <TableCaption>Shipment Details</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Shipment ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Payment Amount</TableHead>
            <TableHead>From City</TableHead>
            <TableHead>To City</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : shipments.length > 0 ? (
            shipments.map((shipment) => (
              <TableRow key={shipment.shipment_id}>
                <TableCell className="font-medium">
                  {shipment.shipment_id}
                </TableCell>
                <TableCell>{`${shipment.user.first_name} ${shipment.user.last_name}`}</TableCell>
                <TableCell>{shipment.status}</TableCell>
                <TableCell>
                  {dayjs(shipment.created_at).format("YYYY/MM/DD | HH:mm")}
                </TableCell>
                <TableCell>{shipment.payment?.[0]?.amount || "N/A"}</TableCell>
                <TableCell>{shipment.shipfrom.city || "N/A"}</TableCell>
                <TableCell>{shipment.shipto.city || "N/A"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No shipment data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShipmentTable;
