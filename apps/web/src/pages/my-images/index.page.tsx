import { useState } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Select,
  TextInput,
  Group,
  Title,
  Stack,
  Skeleton,
  Text,
  Container,
  UnstyledButton,
  SelectItem,
  Box,
  Image,
  Grid,
} from '@mantine/core';
import { IconSearch, IconX, IconSelector } from '@tabler/icons-react';

import { accountApi } from 'resources/account';
import { RoutePath } from 'routes';
import { Link } from 'components';

const selectOptions: SelectItem[] = [
  {
    value: 'newest',
    label: 'Newest',
  },
  {
    value: 'oldest',
    label: 'Oldest',
  },
];

const MyImages: NextPage = () => {
  const [search, setSearch] = useState('');

  const { data: account, isLoading: isListLoading } = accountApi.useGet();

  return (
    <>
      <Head>
        <title>My images</title>
      </Head>
      <Stack spacing="lg">
        <Title order={2}>My images</Title>

        {isListLoading && (
          <>
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={`sklton-${String(item)}`}
                height={50}
                radius="sm"
                mb="sm"
              />
            ))}
          </>
        )}
        {account?.usersImages?.length ? (
          <Grid>
            {account?.usersImages?.map((el) => (
              <Grid.Col span={3} key={el._id}>
                <Box maw={240} mx="auto">
                  <Title order={4} align="center">{el.title}</Title>
                  <Image
                    radius="md"
                    src={el.imageUrl}
                    alt={el.title}
                    caption={el.description}
                  />
                </Box>

              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Container p={75}>
            <Text size="xl" color="grey">
              No image, sorry.
            </Text>
            <Link type="router" href={RoutePath.AddImage}>
              Add Image!
            </Link>
          </Container>
        )}
      </Stack>
    </>
  );
};

export default MyImages;
