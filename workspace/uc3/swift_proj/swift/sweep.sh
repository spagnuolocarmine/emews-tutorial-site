#!/bin/bash
set -eu

export TURBINE_USER_LIB=$PWD/../../hpc_zombies/swift/lib

PATH=$HOME/sfw/exm-install-92/stc/bin:$PATH

# zombies hpc requires 4 process for run, so -n
# should be some multiple of 4 + 1 for ALDB server
swift-t -p -n 5 test_sweep.swift -params=model_parameters.txt


