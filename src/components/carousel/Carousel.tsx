import Carousel from "react-spring-3d-carousel";
import { useEffect, useState } from "react";
import { config } from "@react-spring/web";
import Cards from "./Cards";
import { Race } from "../../types/race";

interface Props {
  offset: number;
  width: string;
  height: string;
  margin: string;
  racesForSeason: Race[];
  setSelectedRace: React.Dispatch<React.SetStateAction<Race | undefined>>;
  selectedRace: Race | undefined;
}

const MapCarousel = ({
  offset,
  width,
  height,
  margin,
  racesForSeason,
  selectedRace,
  setSelectedRace,
}: Props): JSX.Element => {
  const [cards, setCards] = useState<
    {
      onClick: () => void;
      key: number;
      content: JSX.Element;
    }[]
  >([]);

  useEffect(() => {
    const cardsList = Cards(racesForSeason);
    const table = cardsList.map((element, index) => {
      const race = racesForSeason[index];
      return {
        ...element,
        onClick: () => setSelectedRace(race),
      };
    });
    setCards(table);
  }, [racesForSeason]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const selectedCircuitIndex = racesForSeason.findIndex((race) => race.raceId === selectedRace?.raceId);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: any) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX);

  const newIndex = (index: number, increment: boolean) => {
    const newIndex = index + (increment ? 1 : -1);
    if (newIndex < 0) return racesForSeason.length - 1;
    if (newIndex > racesForSeason.length - 1) return 0;
    return newIndex;
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      setSelectedRace(racesForSeason[newIndex(selectedCircuitIndex, isLeftSwipe)]);
    }
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
          goToSlide={selectedCircuitIndex}
          offsetRadius={offset}
          showNavigation={false}
          animationConfig={config.gentle}
        />
      )}
    </div>
  );
};

export default MapCarousel;
