#!/bin/bash
set -eu

if [[ ${#*} != 3 ]]
then
  echo "usage: workflow.sh <PROCS> <NUM_CLUSTERS> <NUM_RANDOM_SAMPLING>"
  exit 1
fi

export PROCS=$1   # number of processes
export NUM_CLUSTERS=$2
export NUM_RANDOM_SAMPLING=$3

export T_PROJECT_ROOT=$PWD/..
export TURBINE_OUTPUT_ROOT=$T_PROJECT_ROOT/exp_dirs
WARQ=$T_PROJECT_ROOT/ext/WAR.Q
ZOMBIES=$T_PROJECT_ROOT/../hpc_zombies/swift/lib


PATH=$HOME/sfw/exm-install-py-R/stc/bin:$PATH

export TURBINE_JOBNAME="r_al_1"
export TURBINE_RESIDENT_WORK_WORKERS=1
export RESIDENT_WORK_RANKS=$(( PROCS - 2 ))
  
swift-t -n $PROCS -p -I $WARQ -I $ZOMBIES -r $WARQ -r $ZOMBIES workflow.swift \
        --num_clusters=$NUM_CLUSTERS \
        --num_random_sampling=$NUM_RANDOM_SAMPLING

