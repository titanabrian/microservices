#! /bin/bash
i=1
while [[ $i -ge 0 ]] ; do
  curl "http://localhost/ping?message=request$i"
  ((i += 1))
done
