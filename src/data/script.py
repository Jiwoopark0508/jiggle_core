import sys

if len(sys.argv) < 3:
    sys.exit("argument must be greater than 3")

argv = sys.argv[1], sys.argv[2]
print(argv)
with open(sys.argv[1], 'r') as f, open(sys.argv[2], 'w') as w:
    for ln in f:
        ln = ln.split()
        print(ln)
        w.write('[\"{}\", \"{}\", \"{}\"],\n'.format(ln[0], ln[1], ln[2]))

