import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('state');

    if (req.method === 'GET') {
      const state = await collection.findOne({ _id: 'default' });
      if (!state) return res.status(200).json({});
      return res.status(200).json(state);
    }

    if (req.method === 'POST') {
      const payload = req.body || {};
      const result = await collection.updateOne(
        { _id: 'default' },
        { $set: { ...payload, updatedAt: new Date() } },
        { upsert: true }
      );

      return res.status(200).json({ success: true, result });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Tournament data API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
