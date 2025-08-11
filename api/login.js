// api/login.js
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

    if (!fs.existsSync(usersFilePath)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
    if (!fileContent) { // New check
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const usersData = JSON.parse(fileContent);
    const user = usersData.users.find(u => u.email === email);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful!', user: { email: user.email } });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};