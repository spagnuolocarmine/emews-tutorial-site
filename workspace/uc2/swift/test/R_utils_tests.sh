#!/bin/bash
export R_HOME=/software/R-3.2-el6-x86_64/lib64/R
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/software/R-3.2-el6-x86_64/lib64/R/lib/

swift-t -p -I .. R_utils_tests.swift
