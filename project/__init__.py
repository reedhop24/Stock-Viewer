from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config.from_mapping(
    SECRET_KEY='secret-key-goes-here',
    SQLALCHEMY_DATABASE_URI='mysql+pymysql://root:@localhost/test',
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
)

db = SQLAlchemy(app)

# blueprint for auth routes in our app
from .authorization import auth as auth_blueprint
app.register_blueprint(auth_blueprint.auth)

# blueprint for non-auth parts of app
from .main import main as main_blueprint
app.register_blueprint(main_blueprint.main)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html')

if __name__ == '__main__' or __name__ == '__auth__':
    app.run(debug=True)
    db.create_all()

    