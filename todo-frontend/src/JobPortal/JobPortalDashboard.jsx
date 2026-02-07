import React from "react";
import JobNavbar from "./JobNavbar";
import JobFooter from "./JobFooter";
import JobMainCard from "./JobMainCard";
import ComplaintBook from "./ComplaintBook";

export default function JobPortalDashboard() {
  return (
    <>
      <JobNavbar />
      <JobMainCard />
      <ComplaintBook />
      <JobFooter />
    </>
  );
}
