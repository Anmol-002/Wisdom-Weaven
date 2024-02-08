import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import me from "../../../images/me.jpg";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/anmolll_002";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src={me}
              alt="Founder"
            />
            <Typography>Anmol Ravesh</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              Our mission is to provide a platform for these talented
              individuals to showcase their work and share their craft with the
              world. By purchasing our products, you're not only supporting
              their livelihoods but also preserving the rich tradition of
              handmade crafts.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">
              <b>CONNECT WITH ME</b>
            </Typography>
            <a
              href="https://www.linkedin.com/in/anmol-b075b922a/"
              target="blank"
            >
              <LinkedInIcon className="linkedinSvgIcon" />
            </a>

            <a href="https://wa.me/9464969276" target="blank">
              <WhatsAppIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
