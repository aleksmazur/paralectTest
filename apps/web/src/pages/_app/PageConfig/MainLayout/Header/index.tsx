import { memo, FC } from 'react';
import { RoutePath } from 'routes';
import {
  Header as LayoutHeader,
  Container,
} from '@mantine/core';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import { accountApi } from 'resources/account';

import UserMenu from './components/UserMenu';
import ShadowLoginBanner from './components/ShadowLoginBanner';

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  //   if (!account) {
  //     return (
  //       <LayoutHeader height="72px">
  //         <Container
  //           sx={(theme) => ({
  //             minHeight: '72px',
  //             padding: '0 32px',
  //             display: 'flex',
  //             flex: '1 1 auto',
  //             alignItems: 'center',
  //             justifyContent: 'flex-end',
  //             backgroundColor: theme.white,
  //             borderBottom: `1px solid ${theme.colors.gray[4]}`,
  //           })}
  //           fluid
  //         >
  //           <Link type="router" href={RoutePath.SignIn}>
  //             Sign In
  //           </Link>
  //         </Container>
  //       </LayoutHeader>
  //     );
  //   }

  return (
    <LayoutHeader height="72px">
      {account?.isShadow && <ShadowLoginBanner email={account.email} />}
      <Container
        sx={(theme) => ({
          minHeight: '72px',
          padding: '0 32px',
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.white,
          borderBottom: `1px solid ${theme.colors.gray[4]}`,
        })}
        fluid
      >
        {account
          ? (
            <>
              <Link type="router" href={RoutePath.Home}>
                <LogoImage />
              </Link>
              <Link type="router" href={RoutePath.MyImages}>
                My images
              </Link>
              <Link type="router" href={RoutePath.AddImage}>
                Add Image
              </Link>
              <UserMenu />
            </>
          ) : (
            <>
              <Link type="router" href={RoutePath.SignIn}>
                Sign In
              </Link>
              <Link type="router" href={RoutePath.SignUp}>
                Sign Up
              </Link>
            </>
          )}
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
