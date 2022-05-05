import React from 'react';
import { Box, Button, Divider, Flex, Link, Modal, Text } from 'gestalt';
import { Navigate } from 'react-router-dom';
import { actions } from '../constants';
import routePaths from './routePaths';

interface Props {}

interface State {
  shouldRedirect: boolean;
}

export default class Splash extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      shouldRedirect: false,
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
    const { shouldRedirect } = this.state;

    if (shouldRedirect) {
      return <Navigate to={routePaths.GALLERY} />;
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
              {/* TODO: List of recently selected directories here */}
              {/* TODO: Show a <Divider /> if showing a list of recently selected directories */}

              <Box display="flex" direction="column">
                <Box marginBottom={2}>
                  <Button
                    text="Open a new photo collection"
                    color="blue"
                    onClick={() => {
                      window.electron.ipcRenderer.selectDirectory();
                    }}
                    fullWidth
                  />
                </Box>
              </Box>
            </Flex>
          </Box>

          <Box
            direction="row"
            display="flex"
            justifyContent="center"
            paddingX={12}
            paddingY={4}
            marginBottom={2}
          >
            <Text size="200">
              Consider supporting Minute Photo Manager. Buy me a{' '}
              <Text inline size="200" weight="bold" color="error">
                <Link
                  accessibilityLabel="https://ko-fi.com/mminute"
                  href="https://ko-fi.com/mminute"
                  inline
                  target="blank"
                >
                  coffee!
                </Link>
              </Text>
            </Text>
          </Box>
        </>
      </Modal>
    );
  }
}

// export default function Splash() {
//   return (
//     <Modal
//       accessibilityModalLabel="Select photos location"
//       onDismiss={() => {}}
//       heading="Welcome to Minute Photo Manager"
//     >
//       <>
//         <Box paddingX={8} paddingY={2}>
//           <Flex direction="column" gap={4}>
//             {/* TODO: List of recently selected directories here */}
//             {/* TODO: Show a <Divider /> if showing a list of recently selected directories */}

//             <Box display="flex" direction="column">
//               <Box marginBottom={2}>
//                 <Button
//                   text="Open a new photo collection"
//                   color="blue"
//                   onClick={() => {
//                     window.electron.ipcRenderer.selectDirectory();
//                   }}
//                   fullWidth
//                 />
//               </Box>
//             </Box>
//           </Flex>
//         </Box>

//         <Box
//           direction="row"
//           display="flex"
//           justifyContent="center"
//           paddingX={12}
//           paddingY={4}
//           marginBottom={2}
//         >
//           <Text size="200">
//             Consider supporting Minute Photo Manager. Buy me a{' '}
//             <Text inline size="200" weight="bold" color="error">
//               <Link
//                 accessibilityLabel="https://ko-fi.com/mminute"
//                 href="https://ko-fi.com/mminute"
//                 inline
//                 target="blank"
//               >
//                 coffee!
//               </Link>
//             </Text>
//           </Text>
//         </Box>
//       </>
//     </Modal>
//   );
// }
