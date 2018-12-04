import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.cluster.bicluster import SpectralBiclustering

filename = 'eventmentions_20181119_1_filtered.csv'
n_clusters = (4,5)
cm = plt.get_cmap('bwr')

def get_matrix(filename, rows_field=u'GLOBALEVENTID', cols_field=u'MentionSourceName', value_filed='MentionDocTone', fill_value=0):
    df = pd.read_csv(filename)
    df = df.set_index([rows_field, cols_field])
    mat = df.groupby([rows_field, cols_field])[value_filed].mean().unstack(fill_value=fill_value)
    return mat.values

def rearrange_matrix(raw_data, model):
    fit_data = raw_data[np.argsort(model.row_labels_)]
    fit_data = fit_data[:, np.argsort(model.column_labels_)]
    return fit_data

def plot_matrices(raw_data, fit_data, rows_field=u'GLOBALEVENTID', cols_field=u'MentionSourceName', n_clusters=(4,5)):
    plt.figure()
    plt.subplot(2,1,1)
    plt.pcolor(raw_data, cmap=cm,vmin=-10, vmax=10)
    plt.title('Raw')
    plt.colorbar()

    plt.subplot(2,1,2)
    plt.pcolor(fit_data, cmap=cm,vmin=-10, vmax=10)
    plt.title('Clustered with n_clusters=(%d,%d)' % n_clusters)
    plt.ylabel(rows_field)
    plt.xlabel(cols_field)
    plt.colorbar()

    plt.show()

def do_clustering(filename):
    raw_data = get_matrix(filename)

    sb = SpectralBiclustering(n_clusters=n_clusters, random_state=0)
    sb.fit(raw_data)
    fit_data = rearrange_matrix(raw_data, sb)

    plot_matrices(raw_data, fit_data, n_clusters=n_clusters)


if __name__ == '__main__':
    do_clustering(filename)
