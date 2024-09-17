import React from "react";
import PageHeader from "@/components/PageHeader";
import StepNavigation from "@/components/StepNavigation";
import { AddDealContextProvider } from "@/contexts/addDealContext";
import { Toaster } from "react-hot-toast";
import "./page.css";

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-4 max-w-5xl mx-auto py-12">
      <div className="w-full px-2 lg:px-0">
        <PageHeader title="Create Shipment" subtitle="Place an order" />

        <div className="mt-12 mb-20 flex flex-col gap-x-8 text-sm lg:flex-row">
          <StepNavigation />
          <AddDealContextProvider>
            <div className="w-full">{children}</div>
            <Toaster />
          </AddDealContextProvider>
        </div>
      </div>
    </main>
  );
}
