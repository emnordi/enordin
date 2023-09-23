import Carousel from "react-spring-3d-carousel";
import { useEffect, useState } from "react";
import { config } from "@react-spring/web";
import { CircuitFE } from "../../types/CircruitFE";
import Cards from "./Cards";

interface Props {
  offset: number;
  width: string;
  height: string;
  margin: string;
  goToSlide: number;
  setGoToSlide: React.Dispatch<React.SetStateAction<number>>;
  allCircuits: CircuitFE[];
}

const MapCarousel = ({
  offset,
  width,
  height,
  margin,
  goToSlide,
  setGoToSlide,
  allCircuits,
}: Props): JSX.Element => {
  const [cards, setCards] = useState<
    {
      onClick: () => void;
      key: number;
      content: JSX.Element;
    }[]
  >([]);

  useEffect(() => {
    const cardsList = Cards(allCircuits);
    const table = cardsList.map((element, index) => {
      return { ...element, onClick: () => setGoToSlide(index) };
    });
    setCards(table);
  }, [allCircuits]);

  return (
    <div style={{ width: width, height: height, margin: margin }}>
      {cards?.length > 0 && (
        <Carousel
          slides={cards}
          goToSlide={goToSlide}
          offsetRadius={offset}
          showNavigation={false}
          animationConfig={config.gentle}
        />
      )}
    </div>
  );
};

export default MapCarousel;
