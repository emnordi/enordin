import { Circuit } from "../../types/circuit";
import { hasImage } from "../F1Data/HasImage";
import Card from "../card/Card";

export default function Cards(allCircuits: Circuit[]) {
  return allCircuits.map((element, index) => {
    return {
      key: index,
      content: (
        <Card
          imagen={
            hasImage.includes(element.circuitRef)
              ? element.circuitRef
              : "not_found"
          }
          title={element?.name}
          location={element.location}
          country={element.country}
        />
      ),
    };
  });
}
