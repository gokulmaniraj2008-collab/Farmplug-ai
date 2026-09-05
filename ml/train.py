from __future__ import annotations

import argparse
import json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


def make_features(df: pd.DataFrame, date_col: str) -> pd.DataFrame:
    dates = pd.to_datetime(df[date_col], errors='coerce')
    if dates.isna().any():
        raise ValueError('Invalid dates in training data')
    return pd.DataFrame({
        'year': dates.dt.year,
        'month': dates.dt.month,
        'dayofyear': dates.dt.dayofyear,
        'dow': dates.dt.dayofweek,
        'trend': np.arange(len(df), dtype=float),
    })


def train(path: str, target: str, date_col: str, model_version: str, dataset_version: str) -> dict:
    df = pd.read_csv(path).sort_values(date_col).reset_index(drop=True)
    if target not in df or date_col not in df:
        raise ValueError(f'Missing required columns: {date_col}, {target}')
    df[target] = pd.to_numeric(df[target], errors='coerce')
    df = df.dropna(subset=[target])
    if len(df) < 30:
        raise ValueError('At least 30 historical observations are required for this reference model')
    X = make_features(df, date_col)
    y = df[target].astype(float)
    split = max(1, int(len(df) * 0.8))
    model = HistGradientBoostingRegressor(random_state=42, max_iter=250)
    model.fit(X.iloc[:split], y.iloc[:split])
    pred = model.predict(X.iloc[split:])
    mae = float(mean_absolute_error(y.iloc[split:], pred))
    rmse = float(mean_squared_error(y.iloc[split:], pred) ** 0.5)
    mape = float(np.mean(np.abs((y.iloc[split:] - pred) / np.where(y.iloc[split:] == 0, np.nan, y.iloc[split:]))) * 100)
    return {'model_version': model_version, 'dataset_version': dataset_version, 'observations': len(df), 'mae': mae, 'rmse': rmse, 'mape': mape}


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('csv')
    p.add_argument('--target', default='price_per_kg')
    p.add_argument('--date-col', default='price_date')
    p.add_argument('--model-version', default='baseline-hgb-v1')
    p.add_argument('--dataset-version', default='local-dataset-v1')
    p.add_argument('--output', default='model_metrics.json')
    args = p.parse_args()
    metrics = train(args.csv, args.target, args.date_col, args.model_version, args.dataset_version)
    Path(args.output).write_text(json.dumps(metrics, indent=2))
    print(json.dumps(metrics, indent=2))
