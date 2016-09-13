# swiftrunex run: N sims
export T_PROJECT_ROOT=$PWD/..
export TURBINE_OUTPUT=$PWD/../exp_dirs/exp_swiftrunex
# QUEUE, WALLTIME, PROCS, PPN, AND TURNBINE_JOBNAME will
# be ignored if the -m scheduler flag is not used
export QUEUE=batch
export WALLTIME=00:10:00
export PROCS=1   # number of processes
export PPN=16
export TURBINE_JOBNAME="swiftrunex"
# if R cannot be found, then these will need to be
# uncommented and set correctly.
#export R_HOME=/soft/R/src/R-3.2.2/
#export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/soft/R/src/R-3.2.2/lib/

# Two scripts can be run:
# 1. swiftrun.script -- plain vanilla sweep without the R analysis code
# 2. swiftrun_R.script -- sweep with R analysis 

# pbs scheduler run.
#swift-t -m pbs -p swiftrun.swift -f="$T_PROJECT_ROOT/complete_model/unrolledParamFile.txt"

# Run immediately without a scheduler. Use swiftrun.swift for the vanilla parameters sweep
# without the R analysis code.
swift-t -n 4 -p swiftrun_R.swift -f="$T_PROJECT_ROOT/complete_model/unrolledParamFile.txt"
