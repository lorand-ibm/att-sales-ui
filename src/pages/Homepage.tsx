import React from 'react';
import { Link } from 'react-router-dom';

import Container from '../components/common/container/Container';
import { useGetProjectsQuery } from '../redux/services/projectApi';
import { ROUTES } from '../enums';

const Index = (): JSX.Element => {
  const { data, isLoading, isError, isSuccess } = useGetProjectsQuery();

  return (
    <Container>
      <>
        <h1>Homepage</h1>
        <h2>Projects</h2>
        {isLoading
          ? 'Loading...'
          : isError
          ? 'Error while loading projects'
          : isSuccess &&
            data &&
            data.map((project) => (
              <p>
                <Link to={`${ROUTES.PROJECT}/${project.uuid}`}>{project.housing_company}</Link>
              </p>
            ))}
      </>
    </Container>
  );
};

export default Index;
