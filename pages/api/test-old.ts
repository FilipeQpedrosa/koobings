import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ 
      message: 'Old API format working!',
      timestamp: new Date().toISOString(),
      method: req.method
    })
  } else if (req.method === 'POST') {
    res.status(200).json({ 
      message: 'Old API POST working!',
      timestamp: new Date().toISOString(),
      method: req.method,
      body: req.body
    })
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 