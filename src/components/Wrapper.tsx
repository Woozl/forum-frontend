import { Box } from '@chakra-ui/react';

export type WrapperVariants = 'small' | 'regular';

interface WrapperProps {
  children: React.ReactNode;
  variant?: WrapperVariants;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = 'regular'
}) => {
  return (
    <Box
      maxW={variant === 'regular' ? '800px' : '400px'}
      w='100%'
      mx='auto'
      mt='8'
    >
      {children}
    </Box>
  );
};
