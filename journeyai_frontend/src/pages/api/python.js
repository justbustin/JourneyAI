// pages/api/python.js
import { PythonShell } from 'python-shell';

export default async function handler(req, res) {
  const { method, query } = req;

  if (method === 'GET') {
    try {
      // Execute Python code using python-shell
      const pythonScript = '../../../../agents/';
      const options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        args: [query.arg || 'default'], // Pass command-line arguments to the Python script
      };

      const pythonShell = new PythonShell(pythonScript, options);

      pythonShell.on('message', function (message) {
        // Handle data from Python script
        console.log(message);
      });

      const result = await new Promise((resolve, reject) => {
        pythonShell.end(function (err, code, signal) {
          if (err) reject(err);
          else resolve(code);
        });
      });

      res.status(200).json({ result });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}