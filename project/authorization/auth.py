from flask import Blueprint, render_template, request, session, redirect, url_for, g

from project.models import Users
from project import db, app

from passlib.hash import sha256_crypt
import sys
import functools

auth = Blueprint('auth', __name__, template_folder='templates')

def login_required(view):

    """Decorator to be used before each route in main"""

    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view

@app.before_request
def validate_id():

    """Before each request check if a user is signed in"""

    user_id = session.get('user_id')
    if user_id is None:
        g.user = None
    else:
        if user_id == 'guest':
            g.user = 'Guest'
        else:
            g.user = Users.query.get(user_id)

@auth.route('/login', methods=['GET', 'POST'])
def login():

    """Save returning user to session and DB"""

    if request.method == 'POST':
        email = request.get_json()['email']
        password = request.get_json()['password']
        stay_signed_in = request.get_json()['stay_signed_in']
        try:
            curr_user = Users.query.filter_by(email=email).first()
            if sha256_crypt.verify(password, curr_user.password) == False:
                return {
                    'status': 'error',
                    'error_message': 'Invalid Username or Password'
                }
            session.clear()

            if stay_signed_in == True:
                session['user_id'] = curr_user.id
                session.permanent = True
            else:
                session['user_id'] = curr_user.id
                session.permanent = False

        except:
            return {
                'status': 'error',
                'error_message': 'server error'
            }
        
        return {'status': 'success'}

    return render_template('login.html')

@auth.route('/signup', methods=['GET','POST'])
def signup():

    """Save new user to session and DB"""

    if request.method == 'POST':
        email = request.get_json()['email']
        password = request.get_json()['password']
        stay_signed_in = request.get_json()['stay_signed_in']
        try:
            if Users.query.filter_by(email=email).first() is not None:
                return { 
                    'status': 'error',
                    'error_message': f'{ email } has already been registered'
                }
        
            user = Users(email, password)
            session.clear()
            if stay_signed_in == True:
                session['user_id'] = user.id
                session.permanent = True
            else:
                session['user_id'] = user.id
                session.permanent = False

            db.session.add(user)
            db.session.commit()
        except:
            return {
                'status': 'error',
                'error_message': 'server error'
            }

        return {'status': 'success'}

    return render_template('signup.html')

@auth.route('/logout', methods=["GET"])
def logout():

    """Clear the current session"""

    session.clear()
    return {'status': 'success'}