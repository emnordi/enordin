import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";
import Styles from "./Card.module.css";
import { isMobile } from "react-device-detect";

interface Props {
  imagen: string;
  title: string;
  location: string;
  country: string;
}

const Card = ({ imagen, title, location, country }: Props) => {
  const [show, setShown] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const props3 = useSpring({
    transform: show ? "scale(1.03)" : "scale(1)",
    boxShadow: show ? "0 20px 25px rgb(0 0 0 / 25%)" : "0 2px 10px rgb(0 0 0 / 8%)",
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <animated.div
      className={Styles.card}
      style={{
        ...props3,
        width: `${isMobile ? windowWidth * 0.5 : windowWidth * 0.25}px`,
        fontSize: `${isMobile ? windowWidth * 0.015 : windowWidth * 0.008}px`,
      }}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
    >
      <img
        height={`${isMobile ? windowWidth * 0.3 : windowWidth * 0.14}px`}
        src={"assets/" + imagen + ".jpg"}
        style={{ borderRadius: "20px", border: "none", marginTop: "-10%", aspectRatio: "2500/1618" }}
        alt="Not found"
      />
      <h2>{title}</h2>
      <p>
        Location: {location} - {country}
      </p>
    </animated.div>
  );
};

export default Card;
