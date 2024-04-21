// api/python2.js
import { PythonShell } from 'python-shell';
import path from 'path';

export default async function handler(req, res) {
    try {
      // Path to your Python script
      //const pythonScript = '../../../agents/hello_world.py';

      const {arg1} = req.query;
      const options = {
        args: [arg1] // Pass arguments to the Python script
    };

      const pythonScript = "/home/innoutman/LaHacks2.0/JourneyAI/agents/on_query.py";

      // Execute Python script using python-shell
      const pythonShell = new PythonShell(pythonScript, options);

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
      res.status(500).json({error});
    }
}
