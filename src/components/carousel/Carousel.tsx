import Carousel from "react-spring-3d-carousel";
import { SetStateAction, TouchEventHandler, useEffect, useState } from "react";
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

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: any) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe)
      setGoToSlide(isLeftSwipe ? goToSlide + 1 : goToSlide - 1);
  };

  return (
    <div
      style={{ width: width, height: height, margin: margin }}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
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
