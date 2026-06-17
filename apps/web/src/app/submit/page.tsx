import type { Metadata } from "next";

import { SubmitForm } from "./SubmitForm";

export const metadata: Metadata = {
  title: "Send Your Reference",
  description:
    "Share a jewellery reference with AMI by Arham and get a private feasibility response within 24 hours.",
};

export default function SubmitPage() {
  return <SubmitForm />;
}
