import { requireHotelOwner } from "@/lib/auth/guards";
import ScanClient from "./ScanClient";

export default async function ScanPage() {
  await requireHotelOwner();

  return <ScanClient />;
}