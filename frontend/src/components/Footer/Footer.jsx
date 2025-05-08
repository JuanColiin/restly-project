import { Facebook,  Instagram,  Twitter } from "lucide-react";

import "./Footer.css";

export const Footer = () => {
  return (
 
    <div className="footer">

        <div className="copyright">

            <span>©2025 Restly</span>
        </div>

        <div className="footer-links">


        <Instagram />


        <Twitter />
        <Facebook />

            </div>


    </div>

   
  )
}
