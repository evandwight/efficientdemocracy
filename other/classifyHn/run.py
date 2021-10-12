#!/usr/bin/python
import sys
import numpy as np # linear algebra
# the Naive Bayes model
from sklearn.naive_bayes import MultinomialNB
# function for transforming documents into counts
from sklearn.feature_extraction.text import CountVectorizer
import pickle
import json
import os

def predict(titles):
    fileName = os.path.join(os.path.dirname(__file__),"model.pkl")
    mdata = pickle.load(open(fileName,"rb"))
    vectorizer = CountVectorizer(decode_error="replace",vocabulary=mdata['vocabulary'])
    x = vectorizer.fit_transform(titles)
    return mdata['model'].predict(x)


if __name__ == '__main__':
    #TODO This is bad but easy
    titles = json.loads(sys.argv[1])['titles']
    result =  predict(np.array(titles)).tolist()
    print(json.dumps({'result': result}))