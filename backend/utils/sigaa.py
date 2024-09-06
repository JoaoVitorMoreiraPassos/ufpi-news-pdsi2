import requests
from typing import List, Dict
from abc import ABC, abstractmethod
from concurrent.futures import ThreadPoolExecutor, as_completed

class Sigaa:

    def __init__(self, user, password):
        self.API_HOST = "http://localhost:3001/api/"
        self.user = user
        self.password = password
        self.subjects = None

    def fetch_tasks(self, subject):
        """
        Função para buscar as tarefas de uma disciplina específica.
        """
        accessId = subject.get("accessId")
        tasks = requests.post(
            self.API_HOST + "tasks", json={
                "user": self.user,
                "password": self.password,
                "accessId": accessId
            }).json()
        if tasks.get("error"):
            # tenta novamente
            tasks = requests.post(
                self.API_HOST + "tasks", json={
                    "user": self.user,
                    "password": self.password,
                    "accessId": accessId
                }).json()

        data = tasks.get("data", [])
        print(data)
        if data and data.get("tasks"):
            subject["tasks"] = data["tasks"]
        
        return subject

    def run(self):
        # Obter as disciplinas
        subjects = requests.post(
            self.API_HOST + "subjects", json={
                "user": self.user,
                "password": self.password
            }).json()

        if subjects.get("error"):
            return subjects

        subjects = subjects.get("data", [])
        
        # Utiliza ThreadPoolExecutor para buscar as tarefas em paralelo
        with ThreadPoolExecutor(max_workers=5) as executor:  # Limita o número de threads a 5, ajuste conforme necessário
            future_to_subject = {executor.submit(self.fetch_tasks, subject): subject for subject in subjects}

            for future in as_completed(future_to_subject):
                subject = future_to_subject[future]
                try:
                    data = future.result()
                    subject.update(data)  # Atualiza a disciplina com as tarefas retornadas
                except Exception as exc:
                    print(f"Disciplina {subject.get('accessId')} gerou uma exceção: {exc}")

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