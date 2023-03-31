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
import { IconSearch, IconX, IconSelector } from '@tabler/icons-react';

import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import { imageApi } from 'resources/image';

interface ImagesListParams {
  page?: number;
  perPage?: number;
  searchValue?: string;
  sort?: {
    createdOn: 'asc' | 'desc';
  };
  filter?: {
    createdOn?: {
      sinceDate: Date | null;
      dueDate: Date | null;
    };
  };
}

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

const PER_PAGE = 5;

const Gallery: NextPage = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(selectOptions[0].value);
  const [filterDate, setFilterDate] = useState<DatesRangeValue>();

  const [params, setParams] = useState<ImagesListParams>({});

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const handleSort = useCallback((value: string) => {
    setSortBy(value);
    setParams((prev) => ({
      ...prev,
      sort: value === 'newest' ? { createdOn: 'desc' } : { createdOn: 'asc' },
    }));
  }, []);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  const handleFilter = useCallback(([sinceDate, dueDate]: DatesRangeValue) => {
    setFilterDate([sinceDate, dueDate]);

    if (!sinceDate) {
      setParams((prev) => ({
        ...prev,
        filter: {},
      }));
    }

    if (dueDate) {
      setParams((prev) => ({
        ...prev,
        filter: { createdOn: { sinceDate, dueDate } },
      }));
    }
  }, []);

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

            <Skeleton
              height={42}
              radius="sm"
              visible={isListLoading}
              width="auto"
              style={{ overflow: 'unset' }}
            >
              <DatePickerInput
                type="range"
                size="md"
                placeholder="Pick date"
                value={filterDate}
                onChange={handleFilter}
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
