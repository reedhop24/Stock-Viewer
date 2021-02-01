from . import db 
from passlib.hash import sha256_crypt
import uuid 

class Collections(db.Model):
    id = db.Column('collection_id', db.String(100), primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    graph_data = db.Column(db.String(100000))

    def __init__(self, user, g_data):
        self.id = uuid.uuid4(),
        self.user_id = user,
        self.graph_data = g_data 

class Users(db.Model):
    id = db.Column('user_id', db.String(100), primary_key = True)
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    collection = db.relationship("Collections")

    def __init__(self, email, password):
        self.id = uuid.uuid4()
        self.email = email
        self.password = sha256_crypt.encrypt(password)