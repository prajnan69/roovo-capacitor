import React from 'react';

interface RouteProps {
  path: string;
  component: React.ComponentType<any>;
  match?: any;
}

const Route: React.FC<RouteProps> = ({ component: Component, match }) => {
  return <Component match={match} />;
};

export default Route;
