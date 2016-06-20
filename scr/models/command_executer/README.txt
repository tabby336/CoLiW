Each directory contains:

* a file that directly communicates with the API (*_handlers.js)
Each function from this file will return a Promise which will return the result
or try to fix the error (e.g expired credentials) or send the error to the client.

* a file which identifies the simple commands and launches the to execution

[* optionally a file which interprets the piped commands.
The first part of the command is sent to execution and based on the output
the parameters for the second command are added and then executed]

