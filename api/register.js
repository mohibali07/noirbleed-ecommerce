// api/register.js
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // Correctly get the email and password from the request body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const usersFilePath = path.join(process.cwd(), 'users.json');
    let usersData;
    
    // Check if the users.json file exists, and create it if it doesn't
    if (fs.existsSync(usersFilePath)) {
      usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    } else {
      usersData = { users: [] };
    }

    if (usersData.users.find(user => user.email === email)) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Store password without hashing
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