import type { LocationId } from "../../data/exploration/types";
import LakeLocation from "../../biome/forest/locations/LakeLocation";
import TavernLocation from "../../biome/village/locations/TavernLocation";

interface Props {
  location: LocationId;
}

const LocationView = ({ location }: Props) => {
  switch (location) {
    case "lake":
      return <LakeLocation />;
    case "tavern":
      return <TavernLocation />;
  }
};

export default LocationView;
