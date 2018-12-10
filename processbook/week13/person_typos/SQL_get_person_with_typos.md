# Find best match from list during the SQL query

We can create user-defined functions (UDF) in Javascript for the query using standard SQL.
I used the implementation of Levenshtein distance from [someone on github](https://gist.github.com/andrei-m/982927) to get the min edit-distance between 2 strings. Then I select only the persons who have a match in provided array within 2 edits distance.


```sql
CREATE TEMP FUNCTION Levenshtein(queryname STRING, mylist ARRAY < STRING >)
RETURNS STRUCT<dist FLOAT64, match STRING>
LANGUAGE js AS """
function Levenshtein(a, b){
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 
  var matrix = [];
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }
  return matrix[b.length][a.length];
}
var bestmatch = queryname;
var mindist = 100;
var dist;
for(var n = 0; n < mylist.length; n++){
  dist = Levenshtein(queryname, mylist[n]);
  if (dist < mindist){
    mindist = dist;
    bestmatch = mylist[n];
  }
}
match = {dist: mindist, match: bestmatch};
return match;
""";

SELECT
  SUM(mentions_count) AS corrected_mentions_count,
  bestmatch.match AS corrected_person
FROM (
    SELECT
      COUNT(*) AS mentions_count,
      person,
      Levenshtein(person, ['Bill Neson', 'Donald Trum']) AS bestmatch
    FROM (
      SELECT
        DocumentIdentifier,
        REGEXP_REPLACE(personOffset, r',.*', '') AS person
      FROM
        `gdelt-bq.gdeltv2.gkg_partitioned` gkg,
        UNNEST(SPLIT(V2Persons ,';')) AS personOffset
      WHERE
        _PARTITIONTIME >= TIMESTAMP('2018-11-14')
        AND _PARTITIONTIME < TIMESTAMP('2018-11-15'))
    GROUP BY
      person
    )
WHERE
  bestmatch.dist <= 2
GROUP BY
  corrected_person
ORDER BY
  corrected_mentions_count DESC
```


# Post-query processing

With python we can easily do the same using the standard library [example](./example.py).

# Pantheon

The list of influential people on pantheon is much smaller than potential results from Gdelt. I prefer that we filter at the query level with SQL.

# Issues

Sometimes 2 valid person names differ just by 1 letter. The provided algorithms will see them as the same name with typo(s). We can further tune the function for specific names. For example 'Donald Trump' should be the exact match but 'Francois Hollande' can have up to 2 typos.
