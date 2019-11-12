# hlöðum inn skrá og geymum í breytu
input=$1
sed 's/[[:blank:]]/\n/g' < $1 |
awk '
/[[:alnum:]]/{ print }
'