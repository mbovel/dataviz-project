#!/bin/bash


cat eventmentions_20181119_1.csv |
	awk -F, '{print $1}' |
	sort -n | uniq -c | sort -n |
	awk '$1 > 300 {print $2}' > EvID_above300_counts.csv

cat eventmentions_20181119_1.csv |
	awk -F, '{print $2}' |
	sort -n | uniq -c | sort -n |
	awk '$1 > 200 {print $2}' > SourceID_above200_counts.csv

head eventmentions_20181119_1.csv -n 1 > eventmentions_20181119_1_filtered.csv

for i in `cat EvID_above300_counts.csv`
do
	cat eventmentions_20181119_1.csv |
	awk -F, -v evid=$i '$1 == evid {print}' >> \
	eventmentions_20181119_1_filtered.csv.tmp
done

for j in `cat SourceID_above200_counts.csv`
do
	cat eventmentions_20181119_1_filtered.csv.tmp |
	awk -F, -v sid=$j '$2 == sid {print}' >> \
	eventmentions_20181119_1_filtered.csv.tmp2
done

cat eventmentions_20181119_1_filtered.csv.tmp2 | sort | uniq >> eventmentions_20181119_1_filtered.csv

# clean up
rm eventmentions_20181119_1_filtered.csv.tmp
rm eventmentions_20181119_1_filtered.csv.tmp2
rm EvID_above300_counts.csv
rm SourceID_above200_counts.csv
