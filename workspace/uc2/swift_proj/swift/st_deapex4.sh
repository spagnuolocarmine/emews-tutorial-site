# deapex run: up to N  sims per round
# 4 nodes, 16 PPN total 64 PROCS (1 server, 63 workers)
THIS=$( dirname $0 )
export TURBINE_LOG=0 TURBINE_DEBUG=0 ADLB_DEBUG=0
export T_PROJECT_ROOT=$( cd $THIS/.. ; /bin/pwd )
WAPQ=$T_PROJECT_ROOT/ext/WAP.Q

export TURBINE_OUTPUT=$T_PROJECT_ROOT/exp_dirs/exp_deapex4
export QUEUE=sandyb
export WALLTIME=02:00:00
export PROCS=64   # number of processes
export PPN=16
export TURBINE_JOBNAME="deapex4"
# Resident task workers and ranks
export TURBINE_RESIDENT_WORK_WORKERS=1
export RESIDENT_WORK_RANKS=$(( PROCS - 2 ))

export PYTHONPATH=$PYTHONPATH:~/.local/lib/python3.4/site-packages:$T_PROJECT_ROOT/python:$WAPQ
export R_HOME=/software/R-3.2-el6-x86_64/lib64/R/
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/software/R-3.2-el6-x86_64/lib64/R/lib/

swift-t -m slurm -p -I $WAPQ -r $WAPQ deap_ga.swift -ni=100 -nv=12 -np=100 -r=0
