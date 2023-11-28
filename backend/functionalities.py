import matplotlib.pyplot as plt

def plot_clusters(df_t, value_column = "DIAS_FRECUENCIA_RECARGA", save=False, xlimit=None):
    num_clusters = len(df_t['CLUSTER_KMEANS'].unique())

    fig, ax = plt.subplots(1, 1, figsize=(10, 5))
    for cluster in range(num_clusters):
        data_for_cluster = df_t[df_t['CLUSTER_KMEANS'] == cluster]
        ax.hist(data_for_cluster[value_column], bins=20, alpha=0.5, label=f'Cluster {cluster}')
    if xlimit:
        ax.set_xlim(xlimit)

    ax.set_title(f'Distribution of {value_column} per Cluster')
    ax.set_xlabel(f'{value_column}')
    ax.set_ylabel('Frequency')
    ax.legend()
    plt.tight_layout()
    if save:
        plt.savefig(f"static/images/plot_cluster/{value_column}.png")
        plt.close()
    else:
        plt.show()

def plot_clusters_categorical(df_t, value_column="DIAS_FRECUENCIA_RECARGA", categorical_col="GENDER", cluster_col="CLUSTER_KMEANS", save=False):
    unique_clusters = df_t[cluster_col].unique()
    num_clusters = len(unique_clusters)
    
    fig, ax = plt.subplots(num_clusters//2, 2,figsize=(10, 5))
    fig.suptitle(f'Categorical Columns Disitributions per Cluster', fontsize=12)
    clusters_it = 0
    for row in range(num_clusters//2):
        for col in range(2):
            unique_categories = df_t[categorical_col].unique()
            num_categories = len(unique_categories)
            for category in unique_categories:
                data_for_cluster = df_t[(df_t[categorical_col] == category) & (df_t["CLUSTER_KMEANS"] == clusters_it)]
                ax[row, col].hist(data_for_cluster[value_column], bins=20, alpha=0.5, label=f'{categorical_col} {category}')
            ax[row, col].set_title(f'Histograms for Cluster {clusters_it}')
            ax[row, col].set_xlabel(f'X-Axis Label for {value_column}')
            ax[row, col].set_ylabel('Frequency')
            ax[row, col].legend()
            clusters_it += 1
    plt.tight_layout()
    if save:
        plt.savefig(f"static/images/plot_cluster/{value_column}_{categorical_col}.png")
        plt.close()
    else:
        plt.show()

def plot_clusters_numeric_features(df_t, numeric_col="YEAR", cluster_col="CLUSTER_KMEANS", show_freq=True, save=False):
    unique_clusters = df_t[cluster_col].unique()
    num_clusters = len(unique_clusters)
    
    fig, ax = plt.subplots(num_clusters//2, 2,figsize=(10, 5))
    fig.suptitle(f'Frequency {numeric_col} per cluster', fontsize=12)
    clusters_it = 0
    for row in range(num_clusters//2):
        for col in range(2):
            data_for_cluster = df_t[(df_t["CLUSTER_KMEANS"] == clusters_it)]
            bars = ax[row, col].bar(data_for_cluster[numeric_col].value_counts().index, data_for_cluster[numeric_col].value_counts().values)
            ax[row, col].set_title(f'Histograms for Cluster {clusters_it}')
            ax[row, col].set_xlabel(f'X-Axis Label for {numeric_col}')
            ax[row, col].set_ylabel('Frequency')
            if show_freq:
                for bar in bars:
                    yval = bar.get_height()
                    ax[row, col].text(bar.get_x() + bar.get_width() / 2, yval, round(yval, 2), ha='center', va='bottom')
            clusters_it += 1
    plt.tight_layout()
    if save:
        plt.savefig(f"static/images/plot_cluster/{numeric_col}.png")
        plt.close()
    else:
        plt.show()

def plot_clusters_numeric_features_hist(df_t, numeric_col="YEAR", cluster_col="CLUSTER_KMEANS", show_freq=True, save=False):
    unique_clusters = df_t[cluster_col].unique()
    num_clusters = len(unique_clusters)

    fig, ax = plt.subplots(num_clusters // 2, 2, figsize=(10, 5))
    fig.suptitle(f'Frequency {numeric_col} per cluster', fontsize=12)
    clusters_it = 0

    max_frequency = 0 

    for row in range(num_clusters // 2):
        for col in range(2):
            if clusters_it >= num_clusters:
                break

            data_for_cluster = df_t[df_t["CLUSTER_KMEANS"] == clusters_it]
            
            bars = ax[row, col].bar(data_for_cluster[numeric_col].value_counts().index,
                                    data_for_cluster[numeric_col].value_counts().values)
            
            
            ax[row, col].set_title(f'Histograms for Cluster {clusters_it}')
            
            ax[row, col].set_xlabel(f'X-Axis Label for {numeric_col}')
            ax[row, col].set_ylabel('Frequency')
            
            
            max_frequency = max(max_frequency, data_for_cluster[numeric_col].value_counts().max())
            
            if show_freq:
                for bar in bars:
                    yval = bar.get_height()
                    ax[row, col].text(bar.get_x() + bar.get_width() / 2, yval, round(yval, 2), ha='center', va='bottom')

            clusters_it += 1

    for row in ax:
        for col in row:
            col.set_ylim(0, max_frequency + (max_frequency*0.2))

    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    if save:
        plt.savefig(f"static/images/plot_cluster/{numeric_col}.png")
        plt.close()
    else:
        plt.show()

def plot_clusters_numeric_features_pie(df_t, numeric_col="YEAR", cluster_col="CLUSTER_KMEANS", show_freq=True, save=False, labels=None):
    unique_clusters = df_t[cluster_col].unique()
    num_clusters = len(unique_clusters)

    fig, ax = plt.subplots(num_clusters // 2, 2, figsize=(10, 5))
    fig.suptitle(f'Pie Chart {numeric_col} per cluster', fontsize=12)
    clusters_it = 0

    max_frequency = 0 

    for row in range(num_clusters // 2):
        for col in range(2):
            if clusters_it >= num_clusters:
                break

            data_for_cluster = df_t[df_t["CLUSTER_KMEANS"] == clusters_it]
            values = data_for_cluster[numeric_col].value_counts().sort_index()
            wedges, texts, autotexts = ax[row, col].pie(values, labels=values.index, autopct='%1.1f%%', startangle=90)
            """
            bars = ax[row, col].pie(data_for_cluster[numeric_col].value_counts().index,
                                    data_for_cluster[numeric_col].value_counts().values)
            """
            ax[row, col].set_title(f'Histograms for Cluster {clusters_it}')
            if labels:
                ax[row, col].legend(wedges, labels, title=f'Cluster {clusters_it}', loc="center left", bbox_to_anchor=(1, 0, 0.5, 1))
            else:
                legend_labels = [f"{index} ({count})" for index, count in zip(values.index, values)]
                ax[row, col].legend(wedges, legend_labels, title=f'Cluster {clusters_it}', loc="center left", bbox_to_anchor=(1, 0, 0.5, 1))
            
            max_frequency = max(max_frequency, data_for_cluster[numeric_col].value_counts().max())

            clusters_it += 1


    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    if save:
        plt.savefig(f"static/images/plot_cluster/{numeric_col}.png")
        plt.close()
    else:
        plt.show()