import { useNavigate } from 'react-router-dom';
import { useLayoutEffect, useRef, useState } from 'react';
import { Box, FixedZIndex, Table, TapArea, Text } from 'gestalt';
import Person from 'DataManager/PeopleManager/Person';
import GalleryTabs, { GALLERY_TABS_Z_INDEX } from './GalleryTabs';

interface Props {
  onSelect: (id: string) => void;
  people: Person[];
}

export default function PeopleView({ onSelect, people }: Props) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabsHeight, setTabsHeight] = useState(0);

  useLayoutEffect(() => {
    setTabsHeight(tabsRef.current?.clientHeight || 0);
  }, []);

  return (
    <>
      <Box
        color="white"
        display="flex"
        justifyContent="start"
        marginStart={10}
        position="fixed"
        ref={tabsRef}
        width="100%"
        zIndex={new FixedZIndex(GALLERY_TABS_Z_INDEX)}
      >
        <GalleryTabs activeTab="People" />
      </Box>
      {tabsHeight && (
        <Box
          dangerouslySetInlineStyle={{
            __style: { paddingTop: `${tabsHeight}px` },
          }}
        >
          <Table accessibilityLabel="All tagged people" maxHeight="100vh">
            <Table.Header sticky>
              <Table.Row>
                <Table.SortableHeaderCell
                  onSortChange={() => {}}
                  sortOrder="asc"
                  status="inactive"
                >
                  <Text weight="bold">Id</Text>
                </Table.SortableHeaderCell>

                <Table.SortableHeaderCell
                  onSortChange={() => {}}
                  sortOrder="asc"
                  status="inactive"
                >
                  <Text weight="bold">Last name</Text>
                </Table.SortableHeaderCell>

                <Table.SortableHeaderCell
                  onSortChange={() => {}}
                  sortOrder="asc"
                  status="inactive"
                >
                  <Text weight="bold">First name</Text>
                </Table.SortableHeaderCell>

                <Table.SortableHeaderCell
                  onSortChange={() => {}}
                  sortOrder="asc"
                  status="inactive"
                >
                  <Text weight="bold">Middle name</Text>
                </Table.SortableHeaderCell>

                <Table.SortableHeaderCell
                  onSortChange={() => {}}
                  sortOrder="asc"
                  status="inactive"
                >
                  <Text weight="bold">Description</Text>
                </Table.SortableHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {people.map((personData) => {
                return (
                  <tr
                    key={`tr-${personData.id}`}
                    onClick={() => onSelect(personData.id)}
                    style={{ cursor: 'zoom-in' }}
                  >
                    <Table.Cell>
                      <Text>{personData.id}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{personData.lastName}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{personData.firstName}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{personData.middleName}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text lineClamp={1} title={personData.description}>
                        {personData.description.slice(0, 20) +
                          (personData.description.length > 19 ? '...' : '')}
                      </Text>
                    </Table.Cell>
                  </tr>
                );
              })}
            </Table.Body>
          </Table>
        </Box>
      )}
    </>
  );
}
