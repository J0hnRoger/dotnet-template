import { Provider } from 'react-redux';
import './App.css';

import React from 'react';
import store from './store';

import JobOfferingList from '@components/jobOffering/JobOfferingList';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      Job Offering
      <JobOfferingList />
    </Provider>
  );
};

export default App;
