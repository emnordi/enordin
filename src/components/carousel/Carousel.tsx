import Carousel from "react-spring-3d-carousel";
import { useState } from "react";
import { config } from "@react-spring/web";
import { CircuitFE } from "../../types/CircruitFE";
import Cards from "./Cards";

interface Props {
  offset: number;
  showArrows?: boolean;
  width: string;
  height: string;
  margin: string;
  goToSlide: number;
  setGoToSlide: React.Dispatch<React.SetStateAction<number>>;
  allCircuits: CircuitFE[];
}

const MapCarousel = ({
  offset,
  showArrows,
  width,
  height,
  margin,
  goToSlide,
  setGoToSlide,
  allCircuits,
}: Props): JSX.Element => {
  const cardsList = Cards(allCircuits);
  const table = cardsList.map((element, index) => {
    return { ...element, onClick: () => setGoToSlide(index) };
  });

  // const [offsetRadius, setOffsetRadius] = useState(2);
  //   const [showArrows, setShowArrows] = useState(true);

  const [cards] = useState(table);

  // useEffect(() => {
  //   setOffsetRadius(offset);
  //   // setShowArrows(showArrows);
  // }, [offset, showArrows]);

  return (
    <div style={{ width: width, height: height, margin: margin }}>
      <Carousel
        slides={cards}
        goToSlide={goToSlide}
        offsetRadius={offset}
        showNavigation={false}
        animationConfig={config.gentle}
      />
    </div>
  );
};

export default MapCarousel;
