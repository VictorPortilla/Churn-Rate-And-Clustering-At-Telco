import requests
import google.auth
import google.auth.transport.requests
from google.oauth2 import service_account
import json

class LLaMa:
    SCOPES = ['https://www.googleapis.com/auth/cloud-platform']
    SERVICE_ACCOUNT_FILE = './rare-daylight-405901-b1d5dc97cdc4.json'
    cred = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    auth_req = google.auth.transport.requests.Request()
    cred.refresh(auth_req)
    bearer_token = cred.token
    base_url = "https://us-central1-aiplatform.googleapis.com/v1beta1/projects/{project_id}/locations/us-central1/endpoints/{endpoint_id}:predict"
    project_id = "rare-daylight-405901"
    endpoint_id = "3793563605455077376"

    def __init__(self):
        pass

    def getMessage(self, promt_t):
        request_body = {
            "instances": [
                {
                    "prompt": promt_t,
                    "top_k": 10,
                    "max_tokens":350,
                }
            ]
        }
        full_url = self.base_url.format(project_id=self.project_id, endpoint_id=self.endpoint_id)
        headers = {
            "Authorization": "Bearer {bearer_token}".format(bearer_token=self.bearer_token),
            "Content-Type": "application/json"
        }
        resp = requests.post(full_url, json=request_body, headers=headers)
        resp = resp.json()
        print(resp)
        output_text = resp["predictions"][0].split("Output:\n")[1].strip()
        return output_text 
