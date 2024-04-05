---
id: machine-learning
title: Integrating machine learning with Cartesi
tags: [ml, dapps, mc2gen]
resources:
    - url: https://github.com/Mugen-Builders/m2cgen
      title: Source code for the m2cgen application
---

In this machine learning tutorial, we will predict a classification based on the Titanic dataset, which shows the characteristics of people onboard the Titanic and whether those people survived the disaster. 

You can submit inputs describing a person's features to determine if that person is likely to have survived.

## Set up your environment.
Install these to set up your environment for quick building.

- Sunodo is a simple tool for building applications on Cartesi. [Install Sunodo for your OS of choice](../development/installation.md).

- Docker Desktop is the tool you need to run the Cartesi Machine and its dependencies. [Install Docker](https://www.docker.com/products/docker-desktop/).

- Python: This is used to write your backend application logic. [Install Python3](https://www.python.org/downloads/).


## Understanding the dApp

- ML Model Generation: The dApp generates a logistic regression model using sci-kit-learn, NumPy, and pandas 

- m2cgen Transpilation: The dApp uses the m2cgen (Model to Code Generator) library to transpile the ML model into pure Python code without external dependencies. This translation simplifies the execution process, particularly in the Cartesi Machine environment. 

The practical goal of the application is to predict a classification based on the Titanic dataset. 

Users can submit inputs describing a person’s features (e.g., age, sex, embarked port), and the application predicts whether that person is likely to have survived the Titanic disaster.

The model currently considers only three characteristics of a person to predict their survival, even though other attributes are available in the dataset:

1. Age
2. Sex, which can be `male` or `female`
3. Embarked, which corresponds to the port of embarkation and can be `C` (Cherbourg), `Q` (Queenstown), or `S` (Southampton)

As such, inputs to the dApp should be given as a JSON string such as the following:

```json
{ "Age": 37, "Sex": "male", "Embarked": "S" }
```

The predicted classification result will be `0` (did not survive) or `1` (did survive).

Clone the repo for this project, and let’s go through it:

```shell
git clone https://github.com/Mugen-Builders/m2cgen.git
```


The `m2cgen` folder contains a model folder with a Python script and a `requirements.txt` file. 

The `build_model.py` file contains the logic for creating the model for our solution, while the requirements.txt contains the libraries needed for the script. 

You can think of the `build_model.py` as a jupyter-notebook file, which we experiment with and create models before using. Let's look at what the `build_model.py` does.


```python
import pandas as pd
import m2cgen as m2c 
from sklearn.linear_model import LogisticRegression

model = LogisticRegression()
train_csv = "http://s3.amazonaws.com/assets.datacamp.com/course/Kaggle/train.csv"
include = ["Age", "Sex", "Embarked", "Survived"]
dependent_var = "Survived"

train_df = pd.read_csv(train_csv)
if include:
     train_df = train_df[include]

independent_vars = train_df.columns.difference([dependent_var])
categoricals = []
for col, col_type in train_df[independent_vars].dtypes.iteritems():
     if col_type == 'O':
          categoricals.append(col)
     else:
          train_df[col].fillna(0, inplace=True)
train_df_ohe = pd.get_dummies(train_df, columns=categoricals, dummy_na=True)

x = train_df_ohe[train_df_ohe.columns.difference([dependent_var])]
y = train_df_ohe[dependent_var]
model.fit(x, y)

model_to_python = m2c.export_to_python(model)

model_columns = list(x.columns)
model_classes = train_df[dependent_var].unique().tolist()

with open("model.py", "w") as text_file:
    print(f"{model_to_python}", file=text_file)
    print(f"columns = {model_columns}", file=text_file)
    print(f"classes = {model_classes}", file=text_file)

print("Model exported successfully")
```


The script primarily aims to export and prepare the ML model for integration into our Cartesi application. It includes the necessary libraries and functions to read data, preprocess it, train a model, and export it to a `model.py` file.

The `m2cgen.py` file in the root folder contains the application logic.

```python
from os import environ
import model
import json
import traceback
import logging
import requests

#Cartesi API Definitions
logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

#Util functions
def hex2str(hex):
    return bytes.fromhex(hex[2:]).decode("utf-8")

def str2hex(str):
    return "0x" + str.encode("utf-8").hex()

def classify(input):
    score = model.score(input)
    class_index = None
    if isinstance(score, list):
        class_index = score.index(max(score))
    else:
        if (score > 0):
            class_index = 1
        else:
            class_index = 0
    return model.classes[class_index]

def format(input):
    formatted_input = {}
    for key in input.keys():
        if key in model.columns:
            formatted_input[key] = input[key]
        else:
            ohe_key = key + "_" + str(input[key])
            ohe_key_unknown = key + "_nan"
            if ohe_key in model.columns:
                formatted_input[ohe_key] = 1
            else:
                formatted_input[ohe_key_unknown] = 1
    output = []
    for column in model.columns:
        if column in formatted_input:
            output.append(formatted_input[column])
        else:
            output.append(0)
    return output
#Cartesi API
def handle_advance(data):
    status = "accept"
    try:
        input = hex2str(data["payload"])
        input_json = json.loads(input)
        input_formatted = format(input_json)
        predicted = classify(input_formatted)
        output = str2hex(str(predicted))
        response = requests.post(rollup_server + "/notice", json={"payload": output})
    except Exception as e:
        status = "reject"
        msg = f"Error processing data {data}\n{traceback.format_exc()}"
        response = requests.post(rollup_server + "/report", json={"payload": str2hex(msg)})
    return status

def handle_inspect(data):
    response = requests.post(rollup_server + "/report", json={"payload": data["payload"]})
    return "accept"

handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}

while True:
    response = requests.post(rollup_server + "/finish", json=finish)
    if response.status_code == 202:
        pass
    else:
        rollup_request = response.json()
        data = rollup_request["data"]
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])
```

This script is the core of our application, responsible for interacting with the Cartesi Rollups infrastructure. 

It leverages the pre-trained Machine Learning model we create with the `build_model.py` script and receives input data from the Cartesi Rollup server. 

The script then processes this data, applies the model to make predictions, and communicates the results to the Rollup server. 

The primary functions of this script include data conversion, model prediction, and communication with the Cartesi infrastructure. It ensures our ML-based application seamlessly integrates into Cartesi’, allowing us to harness the power of machine learning within the blockchain environment. 

Now, let’s build and send inputs to the application.

## Build and run the m2cgen application

To build the container of the m2cgen is very straightforward. Run:

```shell
sunodo build
```

After the build process is complete, run the node with the command:

```shell
sunodo run
```

Your application is now ready to receive input.

## Sending inputs to the application

To interact with the application, provide the input in JSON. The input should include key-value pairs for specific features the ML model uses for prediction. Here’s an example:

```json
{
  "Age": 23,
  "Sex": "female",
  "Embarked": "S"
}
```

The application responds with a predicted classification result, where 0 indicates the person did not survive, and 1 indicates survival.

To send inputs, run:

```shell
sunodo send generic
```

<video width="100%" controls poster="/static/img/v1.3/calculatorPoster.png">
    <source src="/videos/M_Cgen.mp4" type="video/mp4" />
    Your browser does not support video tags.
</video>

## Changing the application

This dApp was created generically, so that you can change the target dataset and predictor algorithm.

To change those, open the file `model/build_model.py` and change the following variables defined at the beginning of the script:

- `model`: defines the sci-kit-learn predictor algorithm to use. While it currently uses sklearn.linear_model.LogisticRegression, many other possibilities are available, from several types of linear regressions to solutions such as support vector machines (SVMs).

- `train_csv`: a URL or file path to a CSV file containing the dataset. It should include a first row with the feature names, followed by the data.

- `include`: an optional list indicating a subset of the dataset's features to be used in the prediction model.

- `dependent_var`: the feature to be predicted, such as the entry's classification

