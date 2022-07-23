import NavBar from './NavBar';
import { Wrapper, WrapperVariants } from './Wrapper';

interface LayoutProps {
  children: React.ReactNode;
  variant?: WrapperVariants;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
