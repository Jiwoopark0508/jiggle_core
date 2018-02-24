from datetime import datetime
import sys

if len(sys.argv) < 3:
    sys.exit("argument must be greater than 3")

argv = sys.argv[1], sys.argv[2]
with open(sys.argv[1], 'r') as f, open(sys.argv[2], 'w') as w:
    ret = []
    for ln in f:
        try :
            ln = ln.split()
            ret.append(ln)
        except:
            pass
    ret = sorted(ret, key=lambda x: datetime.strptime(x[0], "%m/%d/%y"))
    ret = list(map(lambda x: str(x) , ret))
    # print(",\n".join(ret))
    w.write(",\n".join(ret))

