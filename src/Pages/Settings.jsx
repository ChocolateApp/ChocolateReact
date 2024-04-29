import { useIsAdmin } from '../Utils/useIsAdmin';

import CreateAccountCard from '../Components/Shared/CreateAccountCard';
import AllAccounts from '../Components/Shared/AllAccounts';
import AllLibraries from '../Components/Shared/AllLibraries';
import GeneralSettings from '../Components/Shared/GeneralSettings';
import RescanAll from '../Components/Shared/RescanAll';

import JustCog from '../Components/Shared/JustCog';
import Back from '../Components/Shared/Back';

export default function Settings() {

  useIsAdmin();

  return (
    <>
      <JustCog />
      <Back />
      <div className="settings">
        <CreateAccountCard />
        <AllAccounts />
        <AllLibraries />
        <RescanAll />
        <GeneralSettings />
      </div>
    </>
  );
}
