# -*- coding: UTF-8 -*-
import os
files = os.listdir(".")

fn = filter(lambda x: x.endswith('.sgf'), files)

print '<html>'
print '<body>'

unsorted=[]
years={}

for f in fn :
    d=f[0:2]
    m=f[3:5]
    #print m
    y=f[6:10]
    if y>="2000" and y<="3000" and m>="01" and m<="12":
        if not years.has_key(y) : years[y]={}
        if not years[y].has_key(m): years[y][m]=[]
        years[y][m].append(f) 

yy= years.keys()
yy.sort()

for year in yy :
    print "<p></p><h1>{0}</h1><p></p>".format(year)
    mmm=years[year]
    mm=mmm.keys()
    mm.sort()
    for m in mm:
        print "<h2>{0}</h2>".format(m)
        for f in mmm[m]:
            print '<p><a href="http://eidogo.com/#url:http://raw.githubusercontent.com/zztrilobit/zztrilobit.github.io/master/sgf/{0}">{0}</a></p>'.format(f)
    
print '</body>'
print '</html>'