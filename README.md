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
![stock-app-login](https://user-images.githubusercontent.com/40578449/106495257-4c0d8000-6470-11eb-89cc-82dc52036d43.PNG)
##### New users are able to register for an account:
![stock-app-signup](https://user-images.githubusercontent.com/40578449/106495420-7fe8a580-6470-11eb-8747-3d17ba55073b.PNG)
##### Once signed in users are able to query stocks between a given date range to view the high, low, open and close of a stock. Users can breakdown that date range by either days or months, they can then save these graphs into their collection.
![stock-app-search](https://user-images.githubusercontent.com/40578449/106495518-a3135500-6470-11eb-9c94-10659e9af246.PNG)
##### If a user navigates to their Collection they will see every graph that they had saved and will have the opportunity to delete those graphs from their collection. 
![Stock-App-Collections](https://user-images.githubusercontent.com/40578449/106495571-b9b9ac00-6470-11eb-930e-ec1de916a991.PNG)
