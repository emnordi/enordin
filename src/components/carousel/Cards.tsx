import { CircuitFE } from "../../types/CircruitFE";
import Card from "../card/Card";

export default function Cards(allCircuits: CircuitFE[]) {
  return allCircuits.map((element, index) => {
    return {
      key: index,
      content: (
        <Card
          imagen={element?.imagen ? element.circuitId : "not_found"}
          title={element?.name}
          location={element.location}
          country={element.country}
        />
      ),
    };
  });
}
