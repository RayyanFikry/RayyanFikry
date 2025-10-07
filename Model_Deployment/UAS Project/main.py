from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np
import pandas as pd

with open("best_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("label_encoder.pkl", "rb") as f:
    le = pickle.load(f)

app = FastAPI(
    title="Obesity Prediction API",
    description="Memprediksi tingkat obesitas berdasarkan gaya hidup",
    version="1.0"
)

class ObesityInput(BaseModel):
    Gender: str
    Age: int
    Height: float
    Weight: float
    family_history_with_overweight: str
    FAVC: str
    FCVC: float
    NCP: float
    CAEC: str
    SMOKE: str
    CH2O: float
    SCC: str
    FAF: float
    TUE: float
    CALC: str
    MTRANS: str

@app.post("/predict")
def predict(data: ObesityInput):
    try:
        input_dict = data.dict()
        input_df = pd.DataFrame([input_dict])

        prediction = model.predict(input_df)[0]
        label = le.inverse_transform([prediction])[0]

        return {
            "input": input_dict,
            "predicted_class": label
        }

    except Exception as e:
        return {"error": str(e)}
