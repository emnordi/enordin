import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";
import Styles from "./Card.module.css";

interface Props {
  imagen: string;
  title: string;
  location: string;
  country: string;
}

const Card = ({ imagen, title, location, country }: Props) => {
  const [show, setShown] = useState(false);

  const props3 = useSpring({
    transform: show ? "scale(1.03)" : "scale(1)",
    boxShadow: show
      ? "0 20px 25px rgb(0 0 0 / 25%)"
      : "0 2px 10px rgb(0 0 0 / 8%)",
  });

  return (
    <animated.div
      className={Styles.card}
      style={props3}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
    >
      <img src={"assets/" + imagen + ".jpg"} alt="Not found" />
      <h2>{title}</h2>
      <p>
        Location: {location} - {country}
      </p>
    </animated.div>
  );
};

export default Card;
