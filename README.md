## Introduction
This project is a backend for a debian control file viewer.

It is live at: [https://limitless-badlands-33802.herokuapp.com/api/packages](https://limitless-badlands-33802.herokuapp.com/api/packages)

## Setup
Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

**Install MongoDB**
To run this project, you need to install the latest version of MongoDB Community Edition first.

[https://docs.mongodb.com/manual/installation/](https://docs.mongodb.com/manual/installation/)

Once you install MongoDB, make sure it's running.

**Install the Dependencies**
Next, from the project folder, install dependencies:
	
	npm i

**Populate the database**

	node seed.js

**Start the server**

	node index.js

This will launch the Node server on port 3900. If that port is busy, you can set a different point in config/default.json.

Open up your browser and head over to:

[http://localhost:3900/api/packages](http://localhost:3900/api/packages)

You should see the list of packages. That confirms that you have set up everything successfully.