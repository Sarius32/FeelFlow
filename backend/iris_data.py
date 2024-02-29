# Copyright 2018 Google LLC. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# =============================================================================

"""Iris dataset (see https://en.wikipedia.org/wiki/Iris_flower_data_set)."""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import numpy as np

IRIS_CLASSES = ('0', '1', '2')
IRIS_DATA = ['8.75,8.735,3.48,3.465,3.245,3.205,2', '6.75,6.321,2.21,2.25,2.216666666666667,2.203333333333333,1', '6.0,4.032,1.565,1.33,1.195,1.375,0', '5.5,3.535,1.115,1.3333333333333335,1.3466666666666667,1.295,0', '9.0,8.623,3.4349999999999996,3.6799999999999997,3.4050000000000002,3.3449999999999998,2', '6.25,6.302,1.3900000000000001,1.46,1.685,1.905,1', '9.25,7.862,3.4966666666666666,3.4533333333333336,3.335,3.1399999999999997,2', '6.75,5.754,1.91,2.24,2.2750000000000004,2.04,1', '7.75,8.469,3.105,3.183333333333333,3.216666666666667,3.3049999999999997,2', '6.0,5.686,2.6366666666666667,2.7333333333333334,2.6950000000000003,2.295,1', '5.5,2.639,1.23,1.185,0.835,0.835,0', '6.5,3.493,2.4749999999999996,2.223333333333333,2.1066666666666665,1.875,1', '7.25,4.895,1.7966666666666666,1.5633333333333332,1.085,1.1,0', '6.25,2.369,1.8399999999999999,1.57,1.0350000000000001,1.135,0', '6.0,6.364,2.1133333333333333,2.2866666666666666,2.4050000000000002,2.285,1', '7.53,9.234,3.4,3.533333333333333,3.4766666666666666,3.635,2', '9.5,8.623,3.73,3.63,3.48,3.56,2', '6.75,8.235,2.2266666666666666,2.0933333333333333,2.17,2.38,1', '10.0,10.365,3.73,3.4050000000000002,3.1,3.125,2', '9.75,9.452,3.495,3.605,3.66,3.695,2', '4.5,2.873,2.1149999999999998,2.61,2.38,1.935,1', '10.0,7.482,2.53,2.89,3.0766666666666667,2.9033333333333333,2', '8.75,7.423,1.9733333333333334,2.0966666666666667,1.715,1.63,1', '8.5,11.582,3.31,3.5100000000000002,3.69,3.395,2', '7.75,9.852,2.81,3.0933333333333333,3.106666666666667,3.045,2', '5.5,3.617,0.6766666666666666,0.4833333333333333,0.41,0.53,0', '8.25,7.541,3.9450000000000003,3.76,3.66,3.8,2']


def load():
  """Load Iris data.

  Returns:
    Iris data as a numpy ndarray of size [n, 4] and dtype `float32`, n being the
      number of available samples.
    Iris classification target as a numpy ndarray of [n, 3] and dtype `float32`.
    The order of the data is randomly shuffled.
  """
  iris_x = []
  iris_y = []
  for line in IRIS_DATA:
    items = line.split(',')
    xs = [float(x) for x in items[:6]]
    iris_x.append(xs)
    # assert items[-1].startswith('Iris-')
    iris_y.append(IRIS_CLASSES.index(items[-1]))

  # Randomly shuffle the data.
  iris_xy = list(zip(iris_x, iris_y))
  np.random.shuffle(iris_xy)
  iris_x, iris_y = zip(*iris_xy)
  return (np.array(iris_x, dtype=np.float32),
          _to_one_hot(iris_y, len(IRIS_CLASSES)))


def _to_one_hot(indices, num_classes):
  """Convert indices to one-hot encoding.

  Args:
    indices: A list of `int` indices with length `n`, each eleemnt of which is
      assumed to be a zero-based class index >= 0 and < `num_classes`.
    num_classes: Total number of possible classes as an `int`.

  Returns:
    A numpy ndarray of shape [n, num_classes] and dtype `float32`.
  """
  one_hot = np.zeros([len(indices), num_classes], dtype=np.float32)
  one_hot[np.arange(len(indices)), indices] = 1
  return one_hot
