import { Card } from "react-daisyui";

import {
  AlertMessageButtons,
  AlertPolygonMap,
  Body,
  ExpirationTime,
  ImpactedAreas,
  MaxHailSize,
  SenderName,
  Title,
  TornadoDetection,
} from "features/active-alerts/AlertCardElements";

export const TornadoWarningAlert = ({ alert }) => {
  const { geometry, properties } = alert;
  const {
    areaDesc,
    effective,
    expires,
    senderName,
    description,
    instruction,
    // *
    // * all [parameter] values return values inside an []
    // *
    parameters: { maxHailSize, tornadoDetection },
  } = properties;

  return (
    <Card className="bg-red-500 p-2">
      <Title>
        <SenderName senderName={senderName} />
        <ExpirationTime expiresTime={expires} />
      </Title>

      <Body>
        <div className="flex justify-between mb-2">
          <TornadoDetection tornadoDetection={tornadoDetection} />
          <MaxHailSize maxHailSize={maxHailSize} />
        </div>

        <ImpactedAreas areaDesc={areaDesc} />
        <AlertPolygonMap geometry={geometry} fillColor="limegreen" />
        {/* <p>{instruction}</p> */}
        <AlertMessageButtons
          description={description}
          instruction={instruction}
        />
      </Body>
    </Card>
  );
};

export const TornadoWatchAlert = ({ alert }) => {
  const { properties } = alert;
  const { areaDesc, effective, expires, senderName, description, instruction } =
    properties;

  return (
    <Card className="bg-yellow-300 p-2">
      <Title>
        <SenderName senderName={senderName} />
        <ExpirationTime expiresTime={expires} />
      </Title>

      <Body>
        <ImpactedAreas areaDesc={areaDesc} />
        {/* <p>{instruction}</p> */}
      </Body>
    </Card>
  );
};

export const SevereStormWarningAlert = ({ alert }) => {
  const { properties } = alert;
  const { areaDesc, effective, expires, senderName, description, instruction } =
    properties;

  return (
    <Card className="bg-orange-500 p-2">
      <Title>
        <SenderName senderName={senderName} />
        <ExpirationTime expiresTime={expires} />
      </Title>

      <Body>
        <ImpactedAreas areaDesc={areaDesc} />
        {/* <p>{instruction}</p> */}
      </Body>
    </Card>
  );
};

export const SevereStormWatchAlert = ({ alert }) => {
  const { properties } = alert;
  const { areaDesc, effective, expires, senderName, description, instruction } =
    properties;

  return (
    <Card className="bg-green-300 p-2">
      <Title>
        <SenderName senderName={senderName} />
        <ExpirationTime expiresTime={expires} />
      </Title>

      <Body>
        <ImpactedAreas areaDesc={areaDesc} />
        {/* <p>{instruction}</p> */}
      </Body>
    </Card>
  );
};
