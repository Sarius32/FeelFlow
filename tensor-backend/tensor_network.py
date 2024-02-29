import time
from datetime import date, datetime
import pymongo

from data_pipeline import run_preprocessing
from iris_network import train, predict

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["users"]


def run_cycle():
    today = date.today()

    collections = mydb.list_collection_names()
    for name in collections:
        collection = mydb[name]
        todaysEntry = collection.find_one({"date": today.strftime("%Y-%m-%d")})

        if todaysEntry is not None \
                and "sleep" in todaysEntry.keys() \
                and "steps" in todaysEntry.keys() \
                and "moods" in todaysEntry.keys() \
                and todaysEntry.get("runTensor", False):
            docs = list(collection.find())

            data = run_preprocessing(docs)
            todayDT = datetime.strptime(today.strftime("%Y-%m-%d"), "%Y-%m-%d")
            todays_input = data.loc[[todayDT]]
            train_data = data.drop(todayDT)
            del data

            trained_model = train(train_data)

            prediction = predict(trained_model, todays_input)

            collection.find_one_and_update({"date": today.strftime("%Y-%m-%d")},
                                           {"$set": {"tensorPrediction": int(prediction), "runTensor": False}})

            print(f"Predicted {prediction} for {name}.")


if __name__ == "__main__":
    while True:
        print("> ===== ===== <")
        run_cycle()
        time.sleep(5)  # * 60)
