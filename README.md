# Capitol Car Cleaners

Running the Application: 
  Once you have cloned the repo from github, navigate into the 'react-node-app' folder and run 'npm install' on the command line. You can then run 'npm start' This will get the server up and runnning locally.
  Once the server is up and running, in another terminal or command prompt, navigate to the 'capitolcarcleaners' folder within 'react-node-app'. Once you are there run 'npm install' and then 'npm start' to get the application running on a local server.
  
  If you run into an issue with the webpack take the following steps:
    (1) If the error reads that it "cannot find module 'webpack'" run 'npm link webpack'
        If it has an error about a problem with the project dependency tree and/or conflicting webpack versions, skip to (2)
    (2) add/edit your .env file to include the line "SKIP_PREFLIGHT_CHECK = true" without the quotes
    (3) delete the 'node_module' folder and 'package-lock.json' from the 'capitolcarcleaners' folder
    (4) run 'npm install' within the 'capitolcarcleaners' folder again
    (5) run 'npm start' to get the application running
