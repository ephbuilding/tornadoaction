import {
  CAT_OUTLOOK_STYLES,
  PROB_TORNADO_STYLES,
  PROB_WIND_HAIL_STYLES,
  PROB_DAYS_4_8_STYLES,
  SIGNIFICANT_STYLES,
} from "constants/convective-outlooks";
import { USStateMap } from "components/D3Maps";
import { reverseAlbersGeoPath } from "utils/geometry";
import { useOutlookLayerById } from "services/convective-outlook-geometry";

export const CategoricalMap = ({ layerID }) => {
  let hasFeatures = false;
  const { data: features } = useOutlookLayerById(layerID);
  if (features) hasFeatures = features[0].properties.dn > 0;

  return (
    <div className="w-full h-full">
      <USStateMap>
        <g>{hasFeatures ? <MappedCatFeatures features={features} /> : null}</g>
      </USStateMap>
    </div>
  );
};
export const ProbabilisticTornadoMap = ({ probLayerId, sigLayerId }) => {
  let hasProbFeatures = false;
  let hasSigFeatures = false;
  const { data: probFeatures } = useOutlookLayerById(probLayerId);
  const { data: sigFeatures } = useOutlookLayerById(sigLayerId);
  if (probFeatures) hasProbFeatures = probFeatures[0].properties.dn > 0;
  if (sigFeatures) hasSigFeatures = sigFeatures[0].properties.dn > 0;

  return (
    <div className="w-full h-full">
      <USStateMap>
        <g>
          {hasProbFeatures ? (
            <MappedProbTornadoFeatures features={probFeatures} />
          ) : null}
          {hasSigFeatures ? (
            <MappedHatchedSigFeatures features={sigFeatures} />
          ) : null}
        </g>
      </USStateMap>
    </div>
  );
};
export const ProbabilisticWindHailMap = ({ probLayerId, sigLayerId }) => {
  let hasProbFeatures = false;
  let hasSigFeatures = false;
  const { data: probFeatures } = useOutlookLayerById(probLayerId);
  const { data: sigFeatures } = useOutlookLayerById(sigLayerId);
  if (probFeatures) hasProbFeatures = probFeatures[0].properties.dn > 0;
  if (sigFeatures) hasSigFeatures = sigFeatures[0].properties.dn > 0;

  return (
    <div className="w-full h-full">
      <USStateMap>
        <g>
          {hasProbFeatures ? (
            <MappedProbWindHailFeatures features={probFeatures} />
          ) : null}
          {hasSigFeatures ? (
            <MappedHatchedSigFeatures features={sigFeatures} />
          ) : null}
        </g>
      </USStateMap>
    </div>
  );
};
export const Days4_8_ProbabilisticMap = ({ probLayerId }) => {
  let hasProbFeatures = false;
  const { data: probFeatures } = useOutlookLayerById(probLayerId);
  if (probFeatures) hasProbFeatures = probFeatures[0].properties.dn > 0;

  return (
    <div className="w-full h-full">
      <USStateMap>
        <g>
          {hasProbFeatures ? (
            <MappedProbDays4_8Features features={probFeatures} />
          ) : null}
        </g>
      </USStateMap>
    </div>
  );
};

// ! --- SUB-COMPONENTS
// CATEGORICAL FEATURES
const MappedCatFeatures = ({ features }) => {
  return features.map((feature) => {
    const key = createConvectiveFeatureKey(feature);
    return <CategoricalFeature key={key} feature={feature} />;
  });
};
const CategoricalFeature = ({ feature }) => {
  const color = CAT_OUTLOOK_STYLES[feature.properties.dn].color;
  return <ConvectiveFeaturePath feature={feature} color={color} />;
};
// PROBABILISTIC TORNADO FEATURES
const MappedProbTornadoFeatures = ({ features }) => {
  return features.map((feature) => {
    const key = createConvectiveFeatureKey(feature);
    return <ProbabilisticTornadoFeature key={key} feature={feature} />;
  });
};
const ProbabilisticTornadoFeature = ({ feature }) => {
  const color = PROB_TORNADO_STYLES[feature.properties.dn].color;
  return <ConvectiveFeaturePath feature={feature} color={color} />;
};
// PROBABILISTIC WIND & HAIL FEATURES
const MappedProbWindHailFeatures = ({ features }) => {
  return features.map((feature) => {
    const key = createConvectiveFeatureKey(feature);
    return <ProbabilisticWindHailFeature key={key} feature={feature} />;
  });
};
const ProbabilisticWindHailFeature = ({ feature }) => {
  const color = PROB_WIND_HAIL_STYLES[feature.properties.dn].color;
  return <ConvectiveFeaturePath feature={feature} color={color} />;
};
// DAYS 4-8 PROBABILISTIC FEATURES
const MappedProbDays4_8Features = ({ features }) => {
  return features.map((feature) => {
    const key = createConvectiveFeatureKey(feature);
    return <ProbabilisticDays4_8Feature key={key} feature={feature} />;
  });
};
const ProbabilisticDays4_8Feature = ({ feature }) => {
  const color = PROB_DAYS_4_8_STYLES[feature.properties.dn].color;
  return <ConvectiveFeaturePath feature={feature} color={color} />;
};
// SIGNIFICANT (hatched) FEATURES
const MappedHatchedSigFeatures = ({ features }) => {
  return features.map((feature) => {
    const key = createConvectiveFeatureKey(feature);
    return <HatchedSignificantFeature key={key} feature={feature} />;
  });
};
const HatchedSignificantFeature = ({ feature }) => {
  return (
    <>
      <defs>
        <pattern
          id="hatchPattern"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2"
            stroke="#000"
            strokeWidth={1}
          />
        </pattern>
      </defs>
      <path
        d={reverseAlbersGeoPath(feature)}
        fill="url(#hatchPattern)"
        stroke="#000"
        // fillOpacity={0.7}
        // strokeOpacity={0.9}
        strokeWidth={1}
      />
    </>
  );
};
// SINGLE CONVECTIVE FEATURE SVG PATH
const ConvectiveFeaturePath = ({ feature, color }) => (
  <path
    d={reverseAlbersGeoPath(feature)}
    fill={color}
    stroke={color}
    fillOpacity={0.6}
    strokeWidth={3}
  />
);
// ! --- UTILS
const createConvectiveFeatureKey = (feature) => {
  return `${feature.properties.idp_source}-${feature.id}`;
};
