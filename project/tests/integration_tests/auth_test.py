from project import app
import unittest
import requests
import json

class AuthTest(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def test_login_get(self):
        result = self.app.get('/login')
        self.assertEqual(result.status_code, 200, 'should equal a succesfull response')
        self.assertEqual(b"Login" in result.data, True, 'should contain Login in html')

    def test_login_post(self):
        result = requests.post('http://127.0.0.1:5000/login', data=json.dumps({"email": "reed@ibqsystems.com", "password": "Bushums24", "stay_signed_in": "false"}), headers={'Content-Type': 'application/json'})
        self.assertEqual(result.status_code, 200, 'should equal a succesfull response')
        self.assertEqual(result.json()['status'], 'success', 'should return a success object')

    def test_signup_get(self):
        result = self.app.get('/signup')
        self.assertEqual(result.status_code, 200, 'should equal a succesfull response')
        self.assertEqual(b"Sign Up" in result.data, True, 'should contain Login in html')

if __name__ == "__main__":
    unittest.main()