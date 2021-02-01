# Stock Viewer

### Overview
##### This is a simple CRUD application that I built in order to get more acquainted with Flask. The basic premise is that users are able to sign up or sign in, search for stocks between a given date range and view the high, low, opening, and closing prices, and save those graphs into their collection.

### Installation. 
##### In order to run this application you need the following Pipenv packages:
##### Flask, Requests, Flask-SQLAlchemy
##### You will also need XAMPP and in turn MySQL
##### Once the above is installed run:
##### git clone
##### cd Stock-Viewer
##### $env:FLASK_APP="project" // dependent on terminal
##### $env:FLASK_ENV="development' // dependent on terminal
##### flask run
##### navigate to http://localhost:5000/

### The Tech Stack
##### Front End: jQuery, HTML, CSS, AJAX, ChartJs
##### Back End: Python, Flask, SQLAlchemy, MySQL

### Functionality
##### Returning users are able to sign in with their email:

##### New users are able to register for an account:

##### Once signed in users are able to query stocks between a given date range to view the high, low, open and close of a stock. Users can breakdown that date range by either days or months, they can then save these graphs into their collection.

##### If a user navigates to their Collection they will see every graph that they had saved and will have the opportunity to delete those graphs from their collection. 