import { Box, Modal as GestaltModal } from 'gestalt';

interface Props {
  accessibilityModalLabel: string;
  heading: React.ReactNode;
  onDismiss: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export default function Modal({
  accessibilityModalLabel,
  heading,
  onDismiss,
  footer,
  children,
}: Props) {
  return (
    <GestaltModal
      accessibilityModalLabel={accessibilityModalLabel}
      onDismiss={onDismiss}
      heading={heading}
      footer={footer}
      size="lg"
    >
      <Box paddingX={8} paddingY={4} minHeight="400px">
        {children}
      </Box>
    </GestaltModal>
  );
}
