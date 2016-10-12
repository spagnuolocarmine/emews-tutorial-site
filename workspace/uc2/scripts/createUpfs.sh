#!/bin/bash

set -eu

params=$1
vals=$2
num=$3
outDir=$4
tproot=$5

modelDir=$tproot"/complete_model/"
#outDir="out"

#cd $outDir
#cd "$(dirname "$0")"
#echo "current directory is: "`pwd`
cPath=$modelDir"lib/*"
parameters_file=$modelDir"scenario.rs/parameters.xml"

if [[ ${JAVA:-0} == 0 ]] 
then
  JAVA=java 
fi
$JAVA -Xmx512m -cp "$cPath" simanneal.params.UPFCreator \
        -pfile "$parameters_file" \
        -params "$params" \
        -vals "$vals" \
        -num "$num" \
        -out "$outDir"

#echo "$params"
#echo "$vals"
#echo "$num"

#echo "hello0" > out/test.txt

#echo "hello1" > out/upf_0001.txt
#echo "hello2" > out/upf_0002.txt
