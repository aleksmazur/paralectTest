import Head from 'next/head';
import { NextPage } from 'next';
import {
  Title,
  Stack,
  Skeleton,
  Text,
  Container,
  Box,
  Image,
  Grid,
} from '@mantine/core';

import { accountApi } from 'resources/account';
import { RoutePath } from 'routes';
import { Link } from 'components';
import { imageApi } from 'resources/image';

const MyImages: NextPage = () => {
  const { data: account, isLoading: isAccountLoading } = accountApi.useGet();
  const { data: images, isLoading: isListLoading } = imageApi.useList({});
  return (
    <>
      <Head>
        <title>My images</title>
      </Head>
      <Stack spacing="lg">
        <Title order={2}>My images</Title>

        {isListLoading && isAccountLoading && (
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
        {images?.items.filter((el) => el.userId === account?._id).length ? (
          <Grid>
            {images?.items?.filter((el) => el.userId === account?._id).map((el) => (
              <Grid.Col span={3} key={el._id}>
                <Box maw={240} mx="auto">
                  <Title order={4} align="center">{el.title}</Title>
                  <Image
                    radius="md"
                    src={el.imageUrl}
                    alt={el.title}
                    caption={el.description}
                  />
                  <Text>{el.raiting ? `${el.raiting} likes` : 'No likes :(' }</Text>
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
