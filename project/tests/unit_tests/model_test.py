import unittest
from project.models import collections, users
from passlib.hash import sha256_crypt

class TestCollection(unittest.TestCase):
    def test_data(self):
        collection = collections('e2b594b2-582f-49ea-9e5b-a386b0cc232a', 'a bunch of data')
        self.assertEqual(collection.graph_data, 'a bunch of data', "Should be a bunch of data")
        self.assertEqual(collection.user_id[0], 'e2b594b2-582f-49ea-9e5b-a386b0cc232a', 'Should match the uuid passed in')

class TestUsers(unittest.TestCase):
    def test_user(self):
        user = users('anEmail@gmail.com', 'password')
        self.assertEqual(user.email, 'anEmail@gmail.com', 'Should match username')
        self.assertEqual(sha256_crypt.verify('password', user.password), True, 'Should match password')

if __name__ == "__main__":
    unittest.main()