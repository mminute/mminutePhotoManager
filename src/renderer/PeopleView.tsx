import { useNavigate } from 'react-router-dom';
import { useLayoutEffect, useRef, useState } from 'react';
import { Box, FixedZIndex } from 'gestalt';
import Person from 'DataManager/PeopleManager/Person';
import GalleryTabs from './GalleryTabs';

interface Props {
  people: Person[];
}

export default function PeopleView({ people }: Props) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabsHeight, setTabsHeight] = useState(0);

  useLayoutEffect(() => {
    setTabsHeight(tabsRef.current?.clientHeight || 0);
  }, []);

  console.log(people);

  return (
    <>
      <Box
        color="white"
        display="flex"
        justifyContent="center"
        position="fixed"
        ref={tabsRef}
        width="100%"
        zIndex={new FixedZIndex(10)}
      >
        <GalleryTabs activeTab="People" />
      </Box>
      {tabsHeight && (
        <Box
          dangerouslySetInlineStyle={{
            __style: { paddingTop: `${tabsHeight}px` },
          }}
        >
          Hello world
        </Box>
      )}
    </>
  );
}
