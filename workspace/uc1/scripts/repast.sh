#!/bin/bash

set -eu

# Args
param_line=$1   # The upf param line
#echo "$param_line"
instanceDir=$2  # The instance directory
emews_root=$3

#echo $instanceDir

modelDir=$emews_root"/complete_model/"

#mkdir $instanceDir # since the swift script is making this
cd $instanceDir
ln -s $modelDir"data" data
#cp $tmp_params upf.txt # now handled by swift

cPath=$modelDir"lib/*"
#echo $cPath
pxml=$modelDir"scenario.rs/batch_params.xml"
#echo $pxml
scenario=$modelDir"scenario.rs"
#echo $scenario
#/Library/Java/JavaVirtualMachines/jdk1.7.0_51.jdk/Contents/Home/bin/
if [[ ${JAVA:-0} == 0 ]]
then
  JAVA=java
fi
$JAVA -Xmx1536m -XX:-UseLargePages -cp "$cPath" repast.simphony.batch.InstanceRunner \
        -pxml "$pxml" \
        -scenario "$scenario" \
        -id 1 "$param_line"
