import requests
# biblioteca para tipagem de dados
from typing import List, Dict
# biblioteca para criar classes abstratas
from abc import ABC, abstractmethod


class Sigaa:

    def __init__(self, user, password):
        self.API_HOST = "http://localhost:3001/api/"
        self.user = user
        self.password = password
        self.subjects = None
        

    def run(self):
        subjects = requests.post(
            self.API_HOST + "subjects", json={
                "user": self.user,
                "password": self.password
            }).json()
        if subjects.get("error"):
            return subjects
        subjects = subjects.get("data", [])
        for subject in subjects:
            accessId = subject.get("accessId")
            tasks = requests.post(
                self.API_HOST + "tasks", json={
                    "user": self.user,
                    "password": self.password,
                    "accessId": accessId
                }).json()
            if tasks.get("error"):
                # try again
                tasks = requests.post(
                    self.API_HOST + "tasks", json={
                        "user": self.user,
                        "password": self.password,
                        "accessId": accessId
                    }).json()
            
            data = tasks.get("data", [])
            if data:
                if data.get("tasks"):
                    subject["tasks"] = data["tasks"]
        self.subjects = subjects
        return subjects
    

if __name__ == "__main__":
    from pprint import pprint
    from time import time
    sigaa = Sigaa("20171b0404c", "joao753951")
    t1 = time()
    sigaa.run()
    print("Time:", time() - t1, "s")
    pprint(sigaa.subjects)