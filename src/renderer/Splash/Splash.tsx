import React from 'react';
import { Box, Button, Divider, Flex, Link, Modal, Text } from 'gestalt';
import { Navigate } from 'react-router-dom';
import { actions } from '../../constants';
import routePaths from '../routePaths';
import SupportMe from './SupportMe';
import OpenExisting from './OpenExisting';
import OpenRecent from './OpenRecent';

interface Props {
  recentDirectories: string[];
}

interface State {
  shouldRedirect: boolean;
  selectedRecentDirectory: string;
}

export default class Splash extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      shouldRedirect: false,
      selectedRecentDirectory: '',
    };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on(
      actions.FILEPATHS_OBTAINED,
      this.handleFilepathsObtained
    );
  }

  componentWillUnmount() {
    window.electron.ipcRenderer.removeListener(
      actions.FILEPATHS_OBTAINED,
      this.handleFilepathsObtained
    );
  }

  handleFilepathsObtained = () => {
    this.setState({ shouldRedirect: true });
  };

  render() {
    const { recentDirectories } = this.props;
    const { selectedRecentDirectory, shouldRedirect } = this.state;

    if (shouldRedirect) {
      return <Navigate to={routePaths.PHOTOS} />;
    }

    return (
      <Modal
        accessibilityModalLabel="Select photos location"
        onDismiss={() => {}}
        heading="Welcome to Minute Photo Manager"
      >
        <>
          <Box paddingX={8} paddingY={2}>
            <Flex direction="column" gap={4}>
              <OpenRecent
                recentDirectories={recentDirectories}
                selectedRecentDirectory={selectedRecentDirectory}
                onSelect={(val: string) =>
                  this.setState({ selectedRecentDirectory: val })
                }
              />

              <OpenExisting />
            </Flex>
          </Box>

          <SupportMe />
        </>
      </Modal>
    );
  }
}
