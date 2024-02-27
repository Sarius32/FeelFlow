import json

# read json data
with open('data.json', 'r') as file:
    data = json.load(file)

# get userinfo
for user_data in data:
    username = user_data["username"]
    matrix = []
    print("userdata ======= ", user_data["info"])
    # get object for each user
    for info in user_data["info"]:
        print("fsfs ======= ", info)
        date = info["date"]
        sleep = info.get("sleep", 0)
        steps = info.get("steps", 0)

        # moods
        if "moods" in info:
            for mood in info["moods"]:
                value = mood["value"]
                time = mood["time"]
                matrix.append([date, sleep, steps, value, time])
        else:
            # no moods
            matrix.append([date, sleep, steps, 0, 0])

    print(f"Matrix for {username}:")
    for row in matrix:
        print(row)
    print()