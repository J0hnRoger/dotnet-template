import { Provider } from 'react-redux';
import './App.css';

import React from 'react';
import store from './store';

import TransactionList from '@components/budget/TransactionList';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <TransactionList />
    </Provider>
  );
};

export default App;
