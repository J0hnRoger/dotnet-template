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
  http.get(`/api/transactions`, (req, res, ctx) => {
    return new HttpResponse(JSON.stringify(transactions), {
      status: 200,
      statusText: 'OK',
    })
  }),

  // POST /api/transactions
  http.post('/api/transactions', async (req, res, ctx) => {
    const newTransaction = await req.json()
    const transaction = {
      id: (transactions.length + 1).toString(),
      ...newTransaction,
      date: newTransaction.date || new Date().toISOString().split('T')[0]
    }
    transactions.push(transaction)
    return res(
      ctx.status(201),
      ctx.json(transaction)
    )
  }),

  // PUT /api/transactions/:id
  http.put('/api/transactions/:id', async (req, res, ctx) => {
    const { id } = req.params
    const updatedTransaction = await req.json()
    const index = transactions.findIndex(t => t.id === id)
    
    if (index === -1) {
      return res(ctx.status(404))
    }

    transactions[index] = { ...transactions[index], ...updatedTransaction }
    return res(
      ctx.status(200),
      ctx.json(transactions[index])
    )
  })
]
