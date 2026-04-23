# PRISM-GRID ML Module

This folder contains the AI/ML prototype service described in the teammate summary:

- Delay prediction: `RandomForestClassifier`
- Cost overrun prediction: `RandomForestRegressor`
- Risk level: rule-based aggregation
- Recommendations: rule engine

## Files

- `generate_dataset.py`: Creates a synthetic training dataset at `dataset/dataset.csv`.
- `preprocess.py`: Shared feature preprocessing and alignment.
- `train_models.py`: Trains both models and saves artifacts.
- `predict_cli.py`: Inference entrypoint used by the Node backend integration.
- `app.py`: Optional Flask microservice wrapper (`/health`, `/train`, `/predict`).
- `requirements.txt`: Python dependencies.

## Train

```powershell
python -m pip install --upgrade --target backend/ml/.pydeps -r backend/ml/requirements.txt
python backend/ml/train_models.py
```

## Predict (CLI)

```powershell
echo {"Vendor_Rating":4,"Rainfall_Level":"High","Labor_Availability":"Medium","Material_Availability":"Low","Project_Complexity":"High","Budget_Utilization":82,"Schedule_Variance_Days":14,"Compliance_Issues":2,"Team_Experience_Years":7,"Change_Request_Count":6,"Safety_Incidents":1} | python backend/ml/predict_cli.py
```

## Optional Flask Service

```powershell
python backend/ml/app.py
```
