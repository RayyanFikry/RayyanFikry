import streamlit as st
import requests

st.set_page_config(page_title="Obesity Prediction", layout="centered")

st.title("🍔 Obesity Level Prediction")
st.markdown("Masukkan data gaya hidup Anda untuk memprediksi tingkat obesitas.")

# ===== Input form =====
with st.form("input_form"):
    Gender = st.selectbox("Gender", ["male", "female"])
    Age = st.number_input("Age", min_value=1, max_value=100, value=25)
    Height = st.number_input("Height (in meters)", min_value=1.0, max_value=2.5, value=1.7)
    Weight = st.number_input("Weight (in kg)", min_value=20.0, max_value=200.0, value=70.0)
    family_history = st.selectbox("Family history with overweight?", ["yes", "no"])
    FAVC = st.selectbox("Frequent consumption of high-calorie food (FAVC)", ["yes", "no"])
    FCVC = st.slider("Frequency of vegetable consumption (1-3)", 1.0, 3.0, 2.0)
    NCP = st.slider("Number of main meals per day", 1.0, 4.0, 3.0)
    CAEC = st.selectbox("Consumption between meals", ["no", "sometimes", "frequently", "always"])
    SMOKE = st.selectbox("Do you smoke?", ["yes", "no"])
    CH2O = st.slider("Daily water intake (1-3)", 1.0, 3.0, 2.0)
    SCC = st.selectbox("Do you monitor your calorie intake?", ["yes", "no"])
    FAF = st.slider("Physical activity frequency (0-3)", 0.0, 3.0, 1.0)
    TUE = st.slider("Time using technology per day (0-3)", 0.0, 3.0, 1.0)
    CALC = st.selectbox("Alcohol consumption", ["no", "sometimes", "frequently", "always"])
    MTRANS = st.selectbox("Primary mode of transport", ["walking", "bike", "motorbike", "public_transportation", "automobile"])

    submitted = st.form_submit_button("Predict")

# ===== On Submit =====
if submitted:
    input_data = {
        "Gender": Gender,
        "Age": int(Age),
        "Height": float(Height),
        "Weight": float(Weight),
        "family_history_with_overweight": family_history,
        "FAVC": FAVC,
        "FCVC": FCVC,
        "NCP": NCP,
        "CAEC": CAEC,
        "SMOKE": SMOKE,
        "CH2O": CH2O,
        "SCC": SCC,
        "FAF": FAF,
        "TUE": TUE,
        "CALC": CALC,
        "MTRANS": MTRANS
    }

    try:
        # Kirim ke FastAPI
        res = requests.post("http://127.0.0.1:8000/predict", json=input_data)
        result = res.json()

        st.success(f"🎯 Predicted Obesity Level: **{result['predicted_class'].replace('_', ' ')}**")

    except Exception as e:
        st.error(f"❌ Error saat menghubungi API: {e}")
