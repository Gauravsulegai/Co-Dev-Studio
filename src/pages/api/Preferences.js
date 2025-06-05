import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/mongodb';
import UserPreference from '@/server/models/userPreference';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  await dbConnect();
  const userEmail = session.user.email;

  if (req.method === 'GET') {
    try {
      const preferences = await UserPreference.findOne({ userEmail });
      return res.status(200).json({ success: true, preferences: preferences || {} });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch preferences' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { darkMode, theme } = req.body;

      const updatedPrefs = await UserPreference.findOneAndUpdate(
        { userEmail },
        { darkMode, theme },
        { new: true, upsert: true }
      );

      return res.status(200).json({ success: true, preferences: updatedPrefs });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to update preferences' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
