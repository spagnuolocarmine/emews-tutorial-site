# deapex run: up to N  sims per round
# 16 nodes, 16 PPN total 256 PROCS (1 server, 255 workers)
THIS=$( dirname $0 )
export TURBINE_LOG=1 TURBINE_DEBUG=1 ADLB_DEBUG=0
export T_PROJECT_ROOT=$( cd $THIS/.. ; /bin/pwd )
WAPQ=$T_PROJECT_ROOT/ext/WAP.Q

#export TURBINE_OUTPUT=$T_PROJECT_ROOT/exp_dirs/exp_local_deapex
# Resident task workers and ranks
export TURBINE_RESIDENT_WORK_WORKERS=1
export RESIDENT_WORK_RANKS=$(( 3 - 2 ))

export PYTHONPATH=$PYTHONPATH:~/.local/lib/python3.4/site-packages:$T_PROJECT_ROOT/python:$WAPQ
export R_HOME=/software/R-3.2-el6-x86_64/lib64/R/
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/software/R-3.2-el6-x86_64/lib64/R/lib/

swift-t -n 3 -p -I $WAPQ -r $WAPQ deap_ga.swift -ni=3 -nv=1 -np=3 -r=0
