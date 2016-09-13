# swiftrunex run: N sims
# 8 nodes, 16 PPN total 128 PROCS (1 server, 127 workers)
export T_PROJECT_ROOT=$PWD/..
export TURBINE_OUTPUT=$PWD/../exp_dirs/exp_swiftrunex
export QUEUE=batch
export WALLTIME=01:30:00
export PROCS=128   # number of processes
export PPN=16
export TURBINE_JOBNAME="swiftrunex"
export PYTHONPATH=$PYTHONPATH:~/.local/lib/python3.3/site-packages:$T_PROJECT_ROOT/python
export R_HOME=/soft/R/src/R-3.2.2/
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/soft/R/src/R-3.2.2/lib/

swift-t -m pbs -p swiftrun.swift -f="$T_PROJECT_ROOT/complete_model/unrolledParamFile.txt"