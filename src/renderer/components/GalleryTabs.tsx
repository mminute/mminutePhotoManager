import { useNavigate } from 'react-router-dom';
import { Tabs } from 'gestalt';
import { routePaths } from '../routePaths';

export const GALLERY_TABS_Z_INDEX = 1;

interface TabHandler {
  activeTabIndex: number;
  event: any;
}

const tabData = [
  { href: routePaths.PHOTOS, text: 'Photos' },
  { href: routePaths.PEOPLE, text: 'People' },
];

interface Props {
  activeTab: 'Photos' | 'People';
}

export default function GalleryTabs({ activeTab }: Props) {
  const navigate = useNavigate();
  const initialIndex = tabData
    .map((tabItem) => tabItem.text)
    .indexOf(activeTab);

  const handleChangeTab = ({ activeTabIndex, event }: TabHandler) => {
    event.preventDefault();
    navigate(tabData[activeTabIndex].href);
  };

  return (
    <Tabs
      activeTabIndex={initialIndex}
      onChange={handleChangeTab}
      tabs={tabData}
    />
  );
}
