import { cacheExchange, Cache, Resolver } from '@urql/exchange-graphcache';
import Router from 'next/router';
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  gql,
  stringifyVariables
} from 'urql';
import { tap, pipe } from 'wonka';
import {
  LogOutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  VoteMutationVariables,
  DeletePostMutationVariables
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

function invalidateAllPosts(cache: Cache) {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter((info) => info.fieldName === 'posts');
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', 'posts', fi.arguments || {});
  });
}

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes('Not authenticated')) {
          Router.replace('/login');
        }
      })
    );
  };

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      'posts'
    );
    info.partial = !isInCache;

    let hasMore = true;
    let results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const posts = cache.resolve(key, 'posts') as string[];
      const hasMoreRes = cache.resolve(key, 'hasMore') as boolean;

      if (!hasMoreRes) hasMore = false;

      results.push(...posts);
    });

    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results
    };

    // const visited = new Set();
    // let result: NullArray<string> = [];
    // let prevOffset: number | null = null;

    // for (let i = 0; i < size; i++) {
    //   const { fieldKey, arguments: args } = fieldInfos[i];
    //   if (args === null || !compareArgs(fieldArgs, args)) {
    //     continue;
    //   }

    //   const links = cache.resolve(entityKey, fieldKey) as string[];
    //   const currentOffset = args[cursorArgument];

    //   if (
    //     links === null ||
    //     links.length === 0 ||
    //     typeof currentOffset !== 'number'
    //   ) {
    //     continue;
    //   }

    //   const tempResult: NullArray<string> = [];

    //   for (let j = 0; j < links.length; j++) {
    //     const link = links[j];
    //     if (visited.has(link)) continue;
    //     tempResult.push(link);
    //     visited.add(link);
    //   }

    //   if (
    //     (!prevOffset || currentOffset > prevOffset) ===
    //     (mergeMode === 'after')
    //   ) {
    //     result = [...result, ...tempResult];
    //   } else {
    //     result = [...tempResult, ...result];
    //   }

    //   prevOffset = currentOffset;
    // }

    // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    // if (hasCurrentPage) {
    //   return result;
    // } else if (!(info as any).store.schema) {
    //   return undefined;
    // } else {
    //   info.partial = true;
    //   return result;
    // }
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = '';

  // only run on server
  if (typeof window === 'undefined') {
    cookie = ctx?.req?.headers.cookie;
  }

  return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie
        ? {
            cookie
          }
        : undefined
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null
        },
        resolvers: {
          Query: {
            posts: cursorPagination()
          }
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, info) => {
              // console.log('start');
              // console.log(cache.inspectFields('Post'));
              // cache.invalidate({
              //   __typename: 'Post',
              //   id: (args as DeletePostMutationVariables).postId
              // });
              // console.log(cache.inspectFields('Post'));
              // console.log('done');
              invalidateAllPosts(cache);
            },
            vote: (_result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId } as any
              );

              if (data) {
                if (data.voteStatus === value) {
                  return;
                }
                const newPoints =
                  (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: value } as any
                );
              }
            },
            createPost: (_result, args, cache, info) => {
              invalidateAllPosts(cache);
            },
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogOutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },
            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return { me: result.login.user };
                  }
                }
              );
            },
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return { me: result.register.user };
                  }
                }
              );
            }
          }
        }
      }),
      errorExchange,
      ssrExchange,
      fetchExchange
    ]
  };
};
