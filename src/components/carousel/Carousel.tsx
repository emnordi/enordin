import Carousel from "react-spring-3d-carousel";
import { useEffect, useState } from "react";
import { config } from "@react-spring/web";
import Cards from "./Cards";
import { Circuit } from "../../types/circuit";
import { AutoCompleteOptions } from "../autocomplete/F1AutoComplete";
import { circuitToAutoCompleteOption } from "../autocomplete/CircuitAutoComplete";

interface Props {
  offset: number;
  width: string;
  height: string;
  margin: string;
  circuits: Circuit[];
  selectedCircuit: AutoCompleteOptions;
  setSelectedCircuit: React.Dispatch<
    React.SetStateAction<AutoCompleteOptions | undefined>
  >;
}

const MapCarousel = ({
  offset,
  width,
  height,
  margin,
  circuits,
  selectedCircuit,
  setSelectedCircuit,
}: Props): JSX.Element => {
  const [cards, setCards] = useState<
    {
      onClick: () => void;
      key: number;
      content: JSX.Element;
    }[]
  >([]);

  useEffect(() => {
    const cardsList = Cards(circuits);
    const table = cardsList.map((element, index) => {
      const circuit = circuits[index];
      return {
        ...element,
        onClick: () => setSelectedCircuit(circuitToAutoCompleteOption(circuit)),
      };
    });
    setCards(table);
  }, [circuits]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const selectedCircuitIndex = circuits.findIndex(
    (circuit) => circuit.circuitRef === selectedCircuit.id
  );

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
    if (isLeftSwipe || isRightSwipe) {
      setSelectedCircuit(
        circuitToAutoCompleteOption(
          isLeftSwipe
            ? circuits[selectedCircuitIndex + 1]
            : circuits[selectedCircuitIndex - 1]
        )
      );
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
