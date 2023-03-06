import { NextPage } from 'next';
import LoginPage from './login';
import DashboardPage from './dashboard';

const HomePage: NextPage = () => {
  return <LoginPage />;
};

export default HomePage;

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/dashboard',
      permanent: false,
    },
  };
};

export const routes = [
  { path: '/dashboard', page: DashboardPage },
];