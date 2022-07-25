import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useIsAuth = () => {
  const [{ fetching, data }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && data?.me === null)
      router.replace(`/login?next=${router.route}`);
  }, [fetching, data, router]);
};
