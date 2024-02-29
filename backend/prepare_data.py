import json

# read json data
with open('data.json', 'r') as file:
    data = json.load(file)

matrix = []

dates = []
for i in range(len(data)):
    dates.append(data[i].get('date', 0))

for i in range(len(data)):
    date = data[i].get('date', 0)
    sleep = data[i].get('sleep', 0)
    steps = data[i].get('steps', 0)/1000
    eval = data[i].get('evaluation', 0)
    moods = data[i].get('moods', 0)

    for j in moods:
        time = j.get('time',0)
        value = j.get('value', 0)
        matrix.append([date, sleep, steps, value, time, eval])

import pandas as pd
import numpy as np


df = pd.DataFrame(matrix, columns=['date', 'hours', 'steps', 'mood', 'time', 'eval'])

def day(date, res, loc):   
    
    time = ['10:00:00', '12:00:00', '14:00:00', '16:00:00'] 
    for i in range(len(time)):
        res1 = res[res['time'].isin([time[i]])]
        hours = res['hours']
        steps = res['steps']
        eval = res['eval']
        if res1.empty:
            d = {'date': date, 'hours': hours[loc], 'steps': steps[loc], 'mood': np.nan, 'time': time[i], 'eval': eval[loc] }
            new_row = pd.DataFrame(data=d, index = [100000])
            res = pd.concat([res, new_row])
        sorted_frame = res.sort_values(by='time', ascending=True)

    sorted_frame = sorted_frame.interpolate(method='linear', limit_direction='forward', axis=0)
    
    return sorted_frame
    
result = pd.DataFrame(columns=['date', 'hours', 'steps', 'mood', 'time', 'eval'])

for i in dates:
    days = day(i, df[df['date']==i], df.loc[df.date==i,'date'].index[0])
    result = pd.concat([result, days])
final = pd.DataFrame(columns=['date', 'hours', 'steps', 'mood', 'time', 'eval'])
times = ['10:00:00', '12:00:00', '14:00:00', '16:00:00']
for i in times:
    final = pd.concat([final, result.loc[(result['time']==i)]])

end = pd.DataFrame(columns=['date', 'hours', 'steps', 'mood12', 'mood14', 'mood16', 'mood18', 'eval'])
day0 = final[(final['date']==dates[0])]

for i in range(len(dates)):
    selected_day = final[(final['date']==dates[i])]
    hours = selected_day['hours']
    steps = selected_day['steps']
    eval = selected_day['eval']
    mood12 = selected_day[(selected_day['time']==times[0])]
    mood14 = selected_day[(selected_day['time']==times[1])]
    mood16 = selected_day[(selected_day['time']==times[2])]
    mood18 = selected_day[(selected_day['time']==times[3])]

    new_line = pd.DataFrame({'date':i, 'hours':hours.iloc[0], 'steps': steps.iloc[0], 'mood12': mood12.mood.iloc[0], 'mood14': mood14.mood.iloc[0], 'mood16': mood16.mood.iloc[0], 'mood18': mood18.mood.iloc[0], 'eval' : eval.iloc[0]}, index=[0])
    end = pd.concat([end, new_line])

output = end.drop(['date'], axis=1).values.tolist()
a = []
c = []
for i in range(len(output)):
    b = []
    for j in range(len(output[i])):
        b.append(str(output[i][j]))
    c.append(','.join(b))

def data_export():
    return c
# print(c)

