import React, { useState, useEffect } from 'react';
import Route from './Route';

interface RouterProps {
  children: React.ReactNode;
}

const Router: React.FC<RouterProps> = ({ children }) => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', onLocationChange);

    return () => {
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  let matchedComponent: React.ReactElement | null = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === Route && !matchedComponent) {
      const { path: routePath } = child.props as { path: string; component: React.ComponentType<any> };
      const regex = new RegExp(`^${routePath.replace(/:\w+/g, '([^/]+)')}$`);
      const match = path.match(regex);

      if (match) {
        matchedComponent = React.cloneElement(child, { match });
      }
    }
  });

  return matchedComponent;
};

export default Router;
