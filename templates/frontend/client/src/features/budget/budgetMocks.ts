import { http, HttpResponse } from 'msw'

const transactions = [
  {
    id: '1',
    date: '2024-03-15',
    description: 'Grocery Shopping',
    amount: -85.50,
    category: 'Food',
    type: 'expense'
  },
  {
    id: '2',
    date: '2024-03-14',
    description: 'Salary March',
    amount: 3200.00,
    category: 'Income',
    type: 'income'
  },
  {
    id: '3',
    date: '2024-03-13',
    description: 'Netflix Subscription',
    amount: -14.99,
    category: 'Entertainment',
    type: 'expense'
  },
  {
    id: '4',
    date: '2024-03-12',
    description: 'Freelance Work',
    amount: 500.00,
    category: 'Income',
    type: 'income'
  },
  {
    id: '5',
    date: '2024-03-11',
    description: 'Restaurant',
    amount: -45.00,
    category: 'Food',
    type: 'expense'
  }
]

export const handlers = [
  // GET /api/transactions
  http.get(`/api/transactions`, () => {
    return new HttpResponse(JSON.stringify(transactions), {
      status: 200,
      statusText: 'OK',
    })
  }),
]
