# -*- coding: UTF-8 -*-
import os
files = os.listdir(".")

fn = filter(lambda x: x.endswith('.sgf'), files)

print '<html>'
print '<body>'
for f in fn :
    print '<p><a href="http://eidogo.com/#url:http://raw.githubusercontent.com/zztrilobit/zztrilobit.github.io/master/sgf/{0}">{0}</a></p>'.format(fn)
    
print '</body>'
print '</html>'