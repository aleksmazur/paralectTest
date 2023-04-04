import { ChangeEvent, useCallback, useLayoutEffect, useState } from 'react';
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
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconX, IconSelector, IconHeart } from '@tabler/icons-react';
import { imageApi } from 'resources/image';
import { showNotification } from '@mantine/notifications';
import { z } from 'zod';

interface ImagesListParams {
  page?: number;
  perPage?: number;
  searchValue?: string;
  sort?: {
    raiting: 'asc' | 'desc';
  };
}

interface Likes {
  id: string;
  raiting: number;
}

const selectOptions: SelectItem[] = [
  {
    value: 'popular',
    label: 'The most popular',
  },
  {
    value: 'unpopular',
    label: 'Not popular',
  },
];

const PER_PAGE = 50;

const schema = z.object({
  _id: z.string(),
  raiting: z.number(),
});

type UpdateRaiting = z.infer<typeof schema>;

const Gallery: NextPage = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(selectOptions[0].value);

  const [params, setParams] = useState<ImagesListParams>({});
  const [likes, setLike] = useState<Likes[]>([]);
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const handleSort = useCallback((value: string) => {
    setSortBy(value);
    setParams((prev) => ({
      ...prev,
      sort: value === 'popular' ? { raiting: 'desc' } : { raiting: 'asc' },
    }));
  }, []);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  const {
    mutate: updateCurrent,
  } = imageApi.useUpdate<UpdateRaiting>();

  const handleLike = (submitData: UpdateRaiting) => updateCurrent(submitData, {
    onSuccess: () => {
      showNotification({
        title: 'Success',
        message: 'Your like added',
        color: 'green',
      });
      setLike((prev) => [
        { id: submitData._id,
          raiting: (prev.find((el) => el.id === submitData._id)?.raiting || 0) + 1 }]);
    },
  });
  console.log(likes);

  useLayoutEffect(() => {
    setParams((prev) => ({ ...prev, page: 1, searchValue: debouncedSearch, perPage: PER_PAGE }));
  }, [debouncedSearch]);

  const { data, isLoading: isListLoading } = imageApi.useList(params);

  return (
    <>
      <Head>
        <title>Gallery</title>
      </Head>
      <Stack spacing="lg">
        <Title order={2}>Gallery</Title>
        <Group noWrap position="apart">
          <Group noWrap>
            <Skeleton
              height={42}
              radius="sm"
              visible={isListLoading}
              width="auto"
              sx={{ flexGrow: 0.25 }}
            >
              <TextInput
                size="md"
                value={search}
                onChange={handleSearch}
                placeholder="Search by title"
                icon={<IconSearch size={16} />}
                rightSection={search ? (
                  <UnstyledButton
                    onClick={() => setSearch('')}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <IconX color="gray" />
                  </UnstyledButton>
                ) : null}
                sx={{ width: '350px' }}
              />
            </Skeleton>

            <Skeleton
              height={42}
              radius="sm"
              visible={isListLoading}
              width="auto"
              sx={{ overflow: !isListLoading ? 'initial' : 'overflow' }}
            >
              <Select
                size="md"
                data={selectOptions}
                value={sortBy}
                onChange={handleSort}
                rightSection={<IconSelector size={16} />}
                withinPortal={false}
                transitionProps={{
                  transition: 'pop-bottom-right',
                  duration: 210,
                  timingFunction: 'ease-out',
                }}
                sx={{ width: '200px' }}
              />
            </Skeleton>
          </Group>
        </Group>
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
        {data?.items.length ? (
          <Grid>
            {data?.items.map((el) => (
              <Grid.Col span={3}>
                <Box maw={240} mx="auto" key={el._id}>
                  <Title order={4} align="center">{el.title}</Title>
                  <Image
                    radius="md"
                    src={el.imageUrl}
                    alt={el.title}
                    caption={el.description}
                  />
                  <Box sx={[{ display: 'flex', justifyContent: 'space-between' }]}>
                    <Text>
                      {`${el.raiting ? (el.raiting + (likes.find((like) => like.id === el._id)?.raiting || 0)) : 'No one'} likes this photo`}
                    </Text>
                    <IconHeart color={likes.find((like) => like.id === el._id) ? 'red' : 'gray'} cursor="pointer" onClick={() => handleLike({ _id: el._id, raiting: el.raiting! })} />
                  </Box>
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Container p={75}>
            <Text size="xl" color="grey">
              No results found, try to adjust your search.
            </Text>
          </Container>
        )}
      </Stack>
    </>
  );
};

export default Gallery;
