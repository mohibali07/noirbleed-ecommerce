// api/register.js
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { email, password } = JSON.parse(req.body);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const usersFilePath = path.join(process.cwd(), 'users.json');
    let usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    if (usersData.users.find(user => user.email === email)) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Password ko plain text mein store kar rahe hain (warning: not recommended)
    usersData.users.push({
      email,
      password: password
    });

    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};