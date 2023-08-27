import React from 'react';
import { Box, Button, Flex, Text } from 'gestalt';
import Modal from './Modal';
import ModalHeading from './ModalHeading';
import { actions } from '../../constants';

interface Props {
  backToSelect: () => void;
  onClearBulkSelection: () => void;
  onDismiss: () => void;
  selectedIds: string[];
}

interface State {
  errorMessage: string | null;
  targetDir: string;
}

export default class Move extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: null,
      targetDir: '',
    };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on(
      actions.SELECT_MOVE_TARGET_SUCCESS,
      this.handleTargetSelected
    );

    window.electron.ipcRenderer.on(
      actions.SELECT_MOVE_TARGET_FAILURE,
      this.handleError
    );
  }

  componentWillUnmount() {
    window.electron.ipcRenderer.removeListener(
      actions.SELECT_MOVE_TARGET_SUCCESS,
      this.handleTargetSelected
    );

    window.electron.ipcRenderer.removeListener(
      actions.SELECT_MOVE_TARGET_FAILURE,
      this.handleError
    );
  }

  handleTargetSelected = (targetDir: string) => {
    this.setState({ targetDir, errorMessage: null });
  };

  handleError = (errorMessage: string) => {
    this.setState({ errorMessage });
  };

  render() {
    const { backToSelect, onDismiss, selectedIds, onClearBulkSelection } =
      this.props;
    const { errorMessage, targetDir } = this.state;

    return (
      <Modal
        accessibilityModalLabel="Move"
        heading={<ModalHeading txt="Move" backToSelect={backToSelect} />}
        onDismiss={onDismiss}
        footer={
          <Flex direction="row" justifyContent="between">
            <Button text="Cancel" onClick={onDismiss} />
            {targetDir && (
              <Button
                text="Confirm"
                color="red"
                onClick={() => {
                  window.electron.ipcRenderer.moveFiles(selectedIds, targetDir);
                  onClearBulkSelection();
                  onDismiss();
                }}
              />
            )}
          </Flex>
        }
      >
        <Flex justifyContent="center">
          <Flex direction="column" gap={2}>
            {errorMessage && (
              <Flex direction="column" gap={2}>
                <Text weight="bold">Error!</Text>
                <Box marginStart={4}>
                  <Text>{errorMessage}</Text>
                </Box>
              </Flex>
            )}

            {targetDir && (
              <Flex direction="column" gap={2}>
                <Text>{`Moving ${selectedIds.length} files to:`}</Text>
                <Box marginStart={4}>
                  <Text weight="bold">{targetDir}</Text>
                </Box>
              </Flex>
            )}

            {!targetDir && (
              <Flex justifyContent="center">
                <Button
                  text="Select destination"
                  onClick={() => window.electron.ipcRenderer.selectMoveTarget()}
                />
              </Flex>
            )}
          </Flex>
        </Flex>
      </Modal>
    );
  }
}
