import React from 'react';

import JustCog from '../Components/Shared/JustCog';

import CreateAccountCard from '../Components/Shared/CreateAccountCard';
import AllAccounts from '../Components/Shared/AllAccounts';
import AllLibraries from '../Components/Shared/AllLibraries';
import GeneralSettings from '../Components/Shared/GeneralSettings';
import RescanAll from '../Components/Shared/RescanAll';

import Back from '../Components/Shared/Back';

export default function Settings() {
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
