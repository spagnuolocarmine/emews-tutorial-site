#!/bin/bash

set -eu

# Args
# TODO: align with call from swiftrun.swift
id=$1
instanceDir=$2  # The instance directory
scenarioDirName=$3 # Name of scenario directory
tproot=$4

#echo $instanceDir

modelDir=$tproot"/complete_model/"

#mkdir $instanceDir # since the swift script is making this
cd $instanceDir
ln -s $modelDir"data" data
#cp $tmp_params upf.txt # now handled by swift

cPath=$modelDir"lib/*"
#echo $cPath
pxml=$modelDir$scenarioDirName"/batch_params.xml"
#echo $pxml
scenario=$modelDir$scenarioDirName
#echo $scenario
param_file="upf.txt"
#/Library/Java/JavaVirtualMachines/jdk1.7.0_51.jdk/Contents/Home/bin/
if [[ ${JAVA:-0} == 0 ]] 
then
  JAVA=java 
fi
$JAVA -Xmx1536m -XX:-UseLargePages -cp "$cPath" repast.simphony.batch.InstanceRunner \
        -pxml "$pxml" \
        -scenario "$scenario" \
        -id $id \
        -pinput "$param_file"

