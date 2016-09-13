import threading
import queue
import random
import numpy as np
import time
import pandas as pd

from deap import base
from deap import creator
from deap import tools
from deap import algorithms

import wapq

df_params = None

def obj_func(x):
    return 0

def create_list_of_lists_string(list_of_lists, super_delim=";", sub_delim=","):
    # super list elements separated by ;
    res = []
    for x in list_of_lists:
        res.append(sub_delim.join(str(n) for n in x))
    return (super_delim.join(res))

def create_fitnesses(params_string):
    """return equivalent length tuple list
    :type params_string: str
    """
    params = params_string.split(";")
    # get length
    res = [(i,) for i in range(len(params))]
    return (res)

def queue_map(obj_func, pops):
    # Note that the obj_func is not used
    # sending data that looks like:
    # [[a,b,c,d],[e,f,g,h],...]
    if not pops:
        return []
    wapq.OUT_put(create_list_of_lists_string(pops))
    result = wapq.IN_get()
    split_result = result.split(',')
    return [(float(x),) for x in split_result]

def make_random_params():
    """Iterate through df_params dataframe and return uniform
    draws from lo_val to hi_val for each parameter"""
    global df_params
    d = {"int":random.randint,"float":random.uniform}
    return [d[i['p_type']](i['lo_val'], i['hi_val']) for ix, i in df_params.iterrows()]

def mutGaussian_int(x, mu, sigma, mi, mx, indpb):
    if random.random() < indpb:
        x += random.gauss(mu, sigma)
        x = int(max(mi, min(mx, round(x))))
    return x

def mutGaussian_float(x, mu, sigma, mi, mx, indpb):
    if random.random() < indpb:
        x += random.gauss(mu, sigma)
        x = max(mi, min(mx, x))
    return x

# Returns a tuple of one individual
def custom_mutate(individual, indpb, sigma_percent):
    global df_params
    for i, m in enumerate(individual):
        row = df_params.iloc[i]
        mi = row.lo_val
        mx = row.hi_val
        delta = mx - mi
        if row.p_type == "int":
            f = mutGaussian_int
        else:
            f = mutGaussian_float
        individual[i] = f(individual[i], mu=0, sigma=sigma_percent * delta, mi=mi, mx=mx, indpb=indpb)
    return individual,

def read_in_params_csv(csv_file_name):
    return pd.read_csv(csv_file_name)

def run():
    """
    :param num_iter: number of generations
    :param num_pop: size of population
    :param seed: random seed
    :param csv_file_name: csv file name (e.g., "params_for_deap.csv")
    """
    wapq.OUT_put("Params")
    params = wapq.IN_get()
    
    # parse params
    (num_iter, num_pop, seed, csv_file_name) = eval('{}'.format(params))
    random.seed(seed)
    global df_params
    df_params = read_in_params_csv(csv_file_name)
    
    creator.create("FitnessMax", base.Fitness, weights=(1.0,))
    creator.create("Individual", list, fitness=creator.FitnessMax)
    toolbox = base.Toolbox()
    toolbox.register("individual", tools.initIterate, creator.Individual,
                     make_random_params)

    toolbox.register("population", tools.initRepeat, list, toolbox.individual)
    toolbox.register("evaluate", obj_func)
    toolbox.register("mate", tools.cxUniform, indpb=0.5)
    toolbox.register("mutate", custom_mutate, indpb=0.5, sigma_percent=0.1)
    toolbox.register("select", tools.selTournament, tournsize=3)
    toolbox.register("map", queue_map)

    pop = toolbox.population(n=num_pop)
    hof = tools.HallOfFame(1)
    stats = tools.Statistics(lambda ind: ind.fitness.values)
    stats.register("avg", np.mean)
    stats.register("std", np.std)
    stats.register("min", np.min)
    stats.register("max", np.max)

    # num_iter-1 generations since the initial population is evaluated once first
    pop, log = algorithms.eaSimple(pop, toolbox, cxpb=0.5, mutpb=0.2, ngen=num_iter - 1,
                                   stats=stats, halloffame=hof, verbose=True)

    fitnesses = [str(p.fitness.values[0]) for p in pop]

    wapq.OUT_put("FINAL")
    # return the final population
    wapq.OUT_put("{0}\n{1}\n{2}".format(create_list_of_lists_string(pop), ';'.join(fitnesses), log))
