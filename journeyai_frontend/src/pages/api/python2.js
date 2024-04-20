// pages/api/run_python.js
import { PythonShell } from 'python-shell';

export default async function handler(req, res) {
    console.log("hello")
  if (req.method === 'GET') {
    try {
      // Path to your Python script

      console.log("HERE")
      const pythonScript = '../../../../agents/hello_world.py';

      // Execute Python script using python-shell
      const pythonShell = new PythonShell(pythonScript);

      // Handle output from Python script
      pythonShell.on('message', function (message) {
        console.log(message);
      });

      // Wait for Python script to complete
      const result = await new Promise((resolve, reject) => {
        pythonShell.end(function (err) {
          if (err) reject(err);
          else resolve('Python script executed successfully');
        });
      });

      res.status(200).json({ message: result });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
