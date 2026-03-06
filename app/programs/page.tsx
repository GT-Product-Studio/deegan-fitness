import { redirect } from "next/navigation";

// /programs is an old page — real product cards live on the homepage.
export default function ProgramsPage() {
  redirect("/");
}
