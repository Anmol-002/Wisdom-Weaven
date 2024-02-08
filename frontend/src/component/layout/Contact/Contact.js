import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:anmol.singh2843@gmail.com">
        <Button>Contact: anmol.singh2843@gmail.com</Button>
      </a>
    </div>
  );
}

export default Contact