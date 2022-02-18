import React, { useState } from 'react';
import cx from 'classnames';
import {
  Button,
  IconGroup,
  IconPlus,
  IconUser,
  Koros,
  Notification,
  SearchInput,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from 'hds-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Container from '../components/common/container/Container';
import ProjectCard from '../components/project/ProjectCard';
import StatusText from '../components/common/statusText/StatusText';
import useLocalStorage from '../utils/useLocalStorage';
import { filterProjectsByEstateAgent } from '../utils/filterProjectsByEstateAgent';
import { RootState } from '../redux/store';
import { useGetProjectsQuery } from '../redux/services/api';

import styles from './Homepage.module.scss';

const T_PATH = 'pages.Homepage';

const Index = (): JSX.Element => {
  const { t } = useTranslation();
  const [showMyProjects, setShowMyProjects] = useLocalStorage({ defaultValue: true, key: `showMyProjects` });
  const { data: projects, isLoading, isError, isSuccess } = useGetProjectsQuery();
  const user = useSelector((state: RootState) => state.auth.user);
  const userFullName = user ? (user.name as string) : '';
  const [searchTerm, setSearchTerm] = useState('');

  const renderToolbar = () => {
    return (
      <Container className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.toolbarButtons}>
            <Button
              variant={showMyProjects ? 'primary' : 'secondary'}
              iconLeft={<IconUser />}
              onClick={() => setShowMyProjects(true)}
            >
              {t(`${T_PATH}.btnMyProjects`)}
            </Button>
            <Button
              variant={showMyProjects ? 'secondary' : 'primary'}
              iconLeft={<IconGroup />}
              onClick={() => setShowMyProjects(false)}
            >
              {t(`${T_PATH}.btnAllProjects`)}
            </Button>
          </div>
          <div className={styles.toolbarSearch}>
            <SearchInput
              label=""
              placeholder={t(`${T_PATH}.searchLabel`)}
              searchButtonAriaLabel={t(`${T_PATH}.searchbtnAriaLabel`)}
              clearButtonAriaLabel={t(`${T_PATH}.searchClearBtnLabel`)}
              onSubmit={() => null}
              onChange={(value) => setSearchTerm(value)}
            />
          </div>
        </div>
        <div className={styles.toolbarRight}>
          <a href="#todo" className="hds-button hds-button--primary">
            <span aria-hidden="true" className="hds-icon">
              <IconPlus />
            </span>
            <span className="hds-button__label">{t(`${T_PATH}.btnAddProject`)}</span>
          </a>
        </div>
      </Container>
    );
  };

  const renderProjects = () => {
    if (projects === undefined) {
      return (
        <Container>
          <p className={styles.statusText}>{t(`${T_PATH}.noProjects`)}</p>
        </Container>
      );
    }

    let visibleProjects = projects;

    if (showMyProjects) {
      visibleProjects = filterProjectsByEstateAgent(projects, userFullName);
    }

    const noProjects = (removeStyling?: boolean) => (
      <div className={cx(!removeStyling && styles.noProjectsText)}>
        <StatusText>{t(`${T_PATH}.noProjects`)}</StatusText>
      </div>
    );

    if (!visibleProjects.length) {
      return (
        <Container>
          {showMyProjects ? <StatusText>{t(`${T_PATH}.noAssignedProjects`)}</StatusText> : noProjects(true)}
        </Container>
      );
    }

    if (searchTerm.length > 0) {
      const searchResults = visibleProjects.filter((project) =>
        project.housing_company.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return (
        <>
          <Container>
            <h2 className={styles.searchText}>
              <span>{t(`${T_PATH}.searchResultsFor`)}:</span> <em>{`"${searchTerm}"`}</em>{' '}
              <span>&ndash;&nbsp; {t(`${T_PATH}.resultCount`, { count: searchResults.length })}</span>
            </h2>
          </Container>
          <Container wide>
            {!!searchResults.length
              ? searchResults.map((project) => (
                  <div key={project.uuid} className={styles.singleProject}>
                    <ProjectCard project={project} renderAsLink />
                  </div>
                ))
              : noProjects()}
          </Container>
        </>
      );
    }

    const archivedProjects = visibleProjects.filter((p) => p.archived);
    const publishedProjects = visibleProjects.filter((p) => !p.archived && p.published);
    const unpublishedProjects = visibleProjects.filter((p) => !p.archived && !p.published);

    return (
      <Container wide>
        <Tabs>
          <TabList className={styles.tabLinks} style={{ marginBottom: 'var(--spacing-m)' }}>
            <Tab>
              {t(`${T_PATH}.tabPublished`)} ({publishedProjects.length})
            </Tab>
            <Tab>
              {t(`${T_PATH}.tabUnpublished`)} ({unpublishedProjects.length})
            </Tab>
            <Tab>
              {t(`${T_PATH}.tabArchived`)} ({archivedProjects.length})
            </Tab>
          </TabList>
          <TabPanel>
            {!!publishedProjects.length
              ? publishedProjects.map((project) => (
                  <div key={project.uuid} className={styles.singleProject}>
                    <ProjectCard project={project} renderAsLink />
                  </div>
                ))
              : noProjects()}
          </TabPanel>
          <TabPanel>
            {!!unpublishedProjects.length
              ? unpublishedProjects.map((project) => (
                  <div key={project.uuid} className={styles.singleProject}>
                    <ProjectCard project={project} renderAsLink />
                  </div>
                ))
              : noProjects()}
          </TabPanel>
          <TabPanel>
            {!!archivedProjects.length
              ? archivedProjects.map((project) => (
                  <div key={project.uuid} className={styles.singleProject}>
                    <ProjectCard project={project} renderAsLink />
                  </div>
                ))
              : noProjects()}
          </TabPanel>
        </Tabs>
      </Container>
    );
  };

  return (
    <>
      <header className={styles.header}>
        <Container>
          <h1>{t(`${T_PATH}.pageTitle`)}</h1>
        </Container>
      </header>
      <Koros type="pulse" flipHorizontal style={{ fill: 'var(--color-engel)' }} />
      {renderToolbar()}
      {isLoading ? (
        <Container>
          <StatusText>{t(`${T_PATH}.loading`)}...</StatusText>
        </Container>
      ) : isError ? (
        <Container>
          <Notification label={t(`${T_PATH}.errorTitle`)} type="error">
            {t(`${T_PATH}.errorLoadingProjects`)}
          </Notification>
        </Container>
      ) : (
        isSuccess && renderProjects()
      )}
    </>
  );
};

export default Index;
