import { NextApiRequest, NextApiResponse } from 'next';
import client from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
      return res.status(204).end()
    }
    const database = client.db('tournament');
    const collection = database.collection('rules');

    if (req.method === 'GET') {
      const rules = await collection.findOne({ _id: 'default' });
      
      if (!rules) {
        return res.status(404).json({ error: 'Rules not found' });
      }

      return res.status(200).json(rules);
    } else if (req.method === 'POST') {
      const result = await collection.updateOne(
        { _id: 'default' },
        {
          $set: {
            ...req.body,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true, result });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
