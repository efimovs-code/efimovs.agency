import { Client } from '@notionhq/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // .trim() убирает случайные пробелы при копировании с телефона
  const auth = (process.env.NOTION_API_KEY || '').trim();
  const databaseId = (process.env.NOTION_DATABASE_ID || '').trim();

  console.log("--- START DEBUG ---");
  console.log("1. API Key exists?", !!auth);
  console.log("2. DB ID exists?", !!databaseId);
  console.log("--- END DEBUG ---");

  const notion = new Client({ auth });

  try {
    const data = req.body;

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Full Name': {
          title: [{ text: { content: data.fullName || 'No Name' } }]
        },
        'Portfolio': {
          url: data.portfolio || null
        },
        'Role': {
          select: { name: data.role || 'Other' }
        },
        'English Level': {
          select: { name: data.englishLevel || 'A1' }
        },
        'Tech Stack': {
          rich_text: [{ text: { content: data.techStack || '' } }]
        },
        'Experience': { // Добавлено поле Experience
          select: { name: data.experience || 'Less than 1 year' }
        },
        'Weekly Availability': {
          select: { name: data.weeklyAvailability || '10-20 hours (Part-time)' }
        },
        'Time Zone / Window': {
          rich_text: [{ text: { content: data.timeZone || '' } }]
        },
        'Intro Video': {
          url: data.introVideo || null
        },
        'Username / Phone': {
          rich_text: [{ text: { content: data.username || '' } }]
        },
        'Agreement': {
          checkbox: Boolean(data.agreement)
        }
      },
    });

    console.log(">>> SUCCESS: Entry created in Notion!");
    return res.status(200).json({ message: 'Success!', id: response.id });
  } catch (error) {
    console.error("Notion API Error:", error);
    return res.status(500).json({ 
      message: 'Notion Error', 
      error: error.message,
      code: error.code 
    });
  }
}