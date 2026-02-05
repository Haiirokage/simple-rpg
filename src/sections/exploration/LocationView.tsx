import type { LocationId } from "../../data/exploration/types";
import LakeLocation from "../../biome/forest/locations/LakeLocation";

interface Props {
  location: LocationId;
}

const LocationView = ({ location }: Props) => {
  switch (location) {
    case "lake":
      return <LakeLocation />;
  }
};

export default LocationView;
