import { QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode, useEffect, useState } from 'react';

import { queryClient } from 'src/lib/react-query/queryClient';

type ReactQueryDevtoolsType = FC<{ initialIsOpen?: boolean }> | null;

type Props = {
  children: ReactNode;
};

export const QueryProvider: FC<Props> = ({ children }) => {
  const [ReactQueryDevtools, setReactQueryDevtools] =
    useState<ReactQueryDevtoolsType>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@tanstack/react-query-devtools')
        .then((module) => {
          setReactQueryDevtools(() => module.ReactQueryDevtools);
        })
        .catch(() => {
          // Devtools not installed, that's okay
        });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {ReactQueryDevtools && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};
