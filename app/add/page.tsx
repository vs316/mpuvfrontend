import { AddRoutes } from "@/types";
import { redirect } from "next/navigation";
import "./page.css";
export default function AddPage() {
  redirect(AddRoutes.SHIPFROM_INFO);
}
