import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# 1. Load dataset
df = pd.read_csv('shipment.csv')

# 2. Select Features (Removed ethylene_ppm and vibration_g)
FEATURE_COLS = [
    'temperature_c', 
    'humidity_pct', 
    'transit_duration_hours', 
    'excursion_duration_mins'
]
TARGET_COL = 'status'

X = df[FEATURE_COLS]
y = df[TARGET_COL]

# 3. Split Data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 4. Train Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. Evaluate Accuracy
accuracy = model.score(X_test, y_test)
print(f"=== Model Accuracy: {accuracy * 100:.1f}% ===")
print("\nClassification Report:\n")
print(classification_report(y_test, model.predict(X_test)))

# 6. Save Model
joblib.dump(model, 'shipment_spoilage_model.pkl')
print("Model successfully updated and saved as 'shipment_spoilage_model.pkl'")