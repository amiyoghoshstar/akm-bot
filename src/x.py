f = open("ban.txt","r")
fsss = open("ban1.txt","w")

for x in f:
  print(x)
  r=x.lower()
  fsss.write(r)
