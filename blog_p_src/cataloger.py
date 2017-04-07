# -*- coding: cp1251 -*-
import os
import codecs
files = os.listdir("..\\sgf")

fn = filter(lambda x: x.endswith('.sgf'), files)

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

prefix = ["Title: {0}-{1} Каталог партий",
"Date: {0}-{1}-01",
"Author: trilobit",
"Category: го",
"Tags: игра го",
"Slug {0}-{1}-01-gogames",
"Status: published"]

def open_ym(y,m) :
    f=codecs.open("content\\{0}.{1}.01_go_catalog.md".format(y,m),"w",encoding="utf-8")
    #f=open("content\\{0}-{1}-01_go_catalog.md".format(y,m),"w")
    for i in prefix:
        f.write(i.format(y,m).decode("cp1251"))
        f.write("\n")
    f.write("\n")
    f.write("\n")
    return f



 
for year in years.keys() :
    print year
    for m in years[year].keys():
        ff=open_ym(year,m)
        for f in years[year][m]:
            ff.write("[{0}](http://eidogo.com/#url:http://raw.githubusercontent.com/zztrilobit/zztrilobit.github.io/master/sgf/{0})\n\n".format(f))
        ff.close()    
