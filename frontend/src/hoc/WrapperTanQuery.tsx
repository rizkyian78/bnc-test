import { QueryClient, QueryClientProvider } from "react-query";

const WithUseQuery = (WrappedComponent: React.FC) => {
  const WithAuth: React.FC = (props) => {
    return (
      <QueryClientProvider client={new QueryClient()}>
        <WrappedComponent />
      </QueryClientProvider>
    );
  };

  return WithAuth;
};

export default WithUseQuery;
