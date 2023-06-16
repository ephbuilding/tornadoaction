import { Stats } from "react-daisyui";

import { PageLayout } from "components";
import {
  TornadoWarningAlert,
  TornadoWatchAlert,
  SevereStormWarningAlert,
  SevereStormWatchAlert,
} from "features/active-alerts";
import {
  useTornadoWarningAlertQuery,
  useTornadoWatchAlertQuery,
  useSevereStormWarningAlertQuery,
  useSevereStormWatchAlertQuery,
} from "services/nws-api-web-service";

const HomeScreen = () => {
  const { data: tornadoWarnings } = useTornadoWarningAlertQuery();
  const { data: tornadoWatches } = useTornadoWatchAlertQuery();
  const { data: stormWarnings } = useSevereStormWarningAlertQuery();
  const { data: stormWatches } = useSevereStormWatchAlertQuery();

  if (tornadoWarnings) console.log(tornadoWarnings);
  if (tornadoWatches) console.log(tornadoWatches);
  if (stormWarnings) console.log(stormWarnings);
  if (stormWatches) console.log(stormWatches);

  const { Stat } = Stats;

  return (
    <PageLayout>
      <Stats className="mb-6">
        <Stats.Stat>
          <Stat.Item variant="title"> ACTIVE WARNINGS</Stat.Item>
          <Stat.Item variant="value">
            {tornadoWarnings ? tornadoWarnings.length : 0}
          </Stat.Item>
        </Stats.Stat>
        <Stats.Stat>
          <Stat.Item variant="title">ACTIVE WATCHES</Stat.Item>
          <Stat.Item variant="value">
            {tornadoWatches ? tornadoWatches.length : 0}
          </Stat.Item>
        </Stats.Stat>
      </Stats>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tornadoWarnings
          ? tornadoWarnings.map((featureObj) => (
              <TornadoWarningAlert key={featureObj.id} alert={featureObj} />
            ))
          : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tornadoWatches
          ? tornadoWatches.map((featureObj) => (
              <TornadoWatchAlert key={featureObj.id} alert={featureObj} />
            ))
          : null}
      </div>
    </PageLayout>
  );
};

export default HomeScreen;
