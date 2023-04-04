import { FC, ReactElement } from 'react';
import { Link } from 'components';
import { RoutePath } from 'routes';

import {
  SimpleGrid, Title,
} from '@mantine/core';

import { useStyles } from './styles';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => {
  const { classes } = useStyles();
  return (
    <SimpleGrid
      cols={1}
      breakpoints={[
        { maxWidth: 'sm', cols: 1, spacing: 'sm' },
      ]}
    >
      <div className={classes.wrapper}>
        <main className={classes.content}>
          {children}
        </main>
      </div>
    </SimpleGrid>
  );
};

export default UnauthorizedLayout;
