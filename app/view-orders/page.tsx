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

// Define the structure of a shipment object
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
    const fetchShipments = async () => {
      try {
        const response = await fetch("http://localhost:3000/shipments");
        const data = await response.json();
        setShipments(data);
      } catch (error) {
        console.error("Error fetching shipments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
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
                <TableCell>
                  {`${shipment.user.first_name} ${shipment.user.last_name}`}
                </TableCell>
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
