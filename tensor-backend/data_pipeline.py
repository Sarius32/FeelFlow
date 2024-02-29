import math
from datetime import datetime

import pandas as pd


def run_preprocessing(docs):
    timestamps = [datetime.strptime("10:00:00", "%H:%M:%S"), datetime.strptime("12:00:00", "%H:%M:%S"),
                  datetime.strptime("14:00:00", "%H:%M:%S"), datetime.strptime("16:00:00", "%H:%M:%S")]

    df = pd.DataFrame(columns=["sleep", "steps", "mood10", "mood12", "mood14", "mood16", "eval"])
    for doc in docs:
        moods = doc["moods"]

        times = []
        values = []
        for mood in moods:
            times.append(datetime.strptime(mood["time"], "%H:%M:%S"))
            values.append(mood["value"])

        mood_s = pd.Series(values, index=times)
        for stamp in timestamps:
            mood_s[stamp] = math.nan

        mood_interp = mood_s.sort_index().interpolate(method="time", limit_direction="both")

        row = [doc["sleep"], doc["steps"] / 1000]  # downscale steps
        for stamp in timestamps:
            row.append(mood_interp[stamp])
        row.append(doc.get("evaluation", math.nan))

        df.loc[datetime.strptime(doc["date"], "%Y-%m-%d")] = row

    return df
