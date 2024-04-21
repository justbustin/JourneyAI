// api/python2.js
import { PythonShell } from 'python-shell';
import path from 'path';
const { spawn } = require('child_process');


function trimPathToDirectory(fullPath, directoryName) {
  // Start with the full path and gradually go up until you find the directory or run out of path
  let currentPath = fullPath;
  while (currentPath !== path.dirname(currentPath)) { // Check if we have reached the root
    if (path.basename(path.dirname(currentPath)) === directoryName) {
      return path.dirname(currentPath); // Return the directory up to the specified folder
    }
    currentPath = path.dirname(currentPath);
  }
  return currentPath; // In case the directory wasn't found, return the last valid path
}

export default async function handler(req, res) {
  try {
    // Path to your Python script
    //const pythonScript = '../../../agents/hello_world.py';

    const arg1 = req.query;
    console.log("arg1", arg1.album)
    const options = {
      args: [arg1.album], // Pass arguments to the Python script
      pythonPath: "/Users/justinnguyen/miniconda3/bin/python3"
    };



    let pythonScript = trimPathToDirectory(__dirname, "JourneyAI")
    pythonScript = path.join(pythonScript, "agents", "on_query.py")
    console.log(pythonScript)



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
    res.status(500).json({ error });
  }
}
