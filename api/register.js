// api/register.js
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const usersFilePath = path.join(process.cwd(), 'users.json');

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let usersData = { users: [] };
    if (fs.existsSync(usersFilePath)) {
      const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
      if (fileContent) { // This is the new check
        usersData = JSON.parse(fileContent);
      }
    }

    if (usersData.users.find(user => user.email === email)) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    usersData.users.push({
      email,
      password,
    });

    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};