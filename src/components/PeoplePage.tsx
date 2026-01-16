import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPeople } from '../api';
import { Person } from '../types/Person';
import { PeopleFilters } from './PeopleFilters';
import { PeopleTable } from './PeopleTable';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams] = useSearchParams();

  const sort = searchParams.get('sort') || '';
  const order = searchParams.get('order') || '';

  useEffect(() => {
    setLoading(true);
    setErrorMessage('');

    getPeople()
      .then(setPeople)
      .catch(() => {
        setErrorMessage('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const sortedPeople = useMemo(() => {
    const copy = [...people];

    if (sort === 'name') {
      copy.sort((a, b) => {
        return order === 'desc'
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      });
    }

    if (sort === 'sex') {
      copy.sort((a, b) => {
        return order === 'desc'
          ? b.sex.localeCompare(a.sex)
          : a.sex.localeCompare(b.sex);
      });
    }

    if (sort === 'born') {
      copy.sort((a, b) => {
        return order === 'desc' ? b.born - a.born : a.born - b.born;
      });
    }

    if (sort === 'died') {
      copy.sort((a, b) => {
        return order === 'desc' ? b.died - a.died : a.died - b.died;
      });
    }

    return copy;
  }, [people, sort, order]);

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          {people.length > 0 && (
            <div className="column is-7-tablet is-narrow-desktop">
              <PeopleFilters />
            </div>
          )}

          <div className="column">
            <PeopleTable
              people={sortedPeople}
              isLoading={loading}
              errorMessage={errorMessage}
            />
          </div>
        </div>
      </div>
    </>
  );
};
