import { Race } from "../../types/race";
import { hasImage } from "../F1Data/HasImage";
import Card from "../card/Card";

export default function Cards(allCircuits: Race[]) {
  return allCircuits.map((element, index) => {
    return {
      key: index,
      content: (
        <Card
          imagen={
            hasImage.includes(element.circuit.circuitRef)
              ? element.circuit.circuitRef
              : "not_found"
          }
          title={element?.name}
          location={element.circuit.location}
          country={element.circuit.country}
        />
      ),
    };
  });
}
