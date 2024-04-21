import Person from 'DataManager/PeopleManager/Person';
import { useState } from 'react';

type SortCol = 'id' | 'lastName' | 'firstName' | 'middleName' | 'description';

interface ChildArgs {
  onSortChange: (col: SortCol) => void;
  sorted: Person[];
  sortCol: SortCol;
  sortOrder: 'asc' | 'desc';
}

interface Props {
  children: (args: ChildArgs) => JSX.Element;
  unsorted: Person[];
}

export default function PeopleTableSorter({ children, unsorted }: Props) {
  const [sortCol, setSortCol] = useState<SortCol>('lastName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const onSortChange = (col: SortCol) => {
    if (sortCol !== col) {
      setSortCol(col);
      setSortOrder('desc');
    } else {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }
  };

  const sorted = unsorted.sort((firstItem, secondItem) => {
    const sortOrderValue = sortOrder === 'asc' ? -1 : 1;
    let firstItemVal = firstItem[sortCol];
    let secondItemVal = secondItem[sortCol];

    if (typeof firstItemVal === 'string') {
      firstItemVal = firstItemVal.toLowerCase();
      secondItemVal = secondItemVal.toLowerCase();
    }

    if (firstItemVal < secondItemVal) {
      return -sortOrderValue;
    }

    if (firstItemVal > secondItemVal) {
      return sortOrderValue;
    }

    return 0;
  });

  return children({ onSortChange, sorted, sortCol, sortOrder });
}
