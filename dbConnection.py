import pymongo 
##mongodb+srv://pm:006@convert.xpxt6px.mongodb.net/
#mongodb+srv://faizafarooq:<AbrakaDabra123>@cluster0.6ybnodw.mongodb.net/?retry Writes=true&w=majority
connection_str="mongodb+srv://pm:006@convert.xpxt6px.mongodb.net/"
try:
    client = pymongo.MongoClient(connection_str)
    print("Connected successfully!!!")
except Exception:
    print("Error in connection")
    
    

myDb = client["Convertor"]

cursor = myDb["drawio_EPC"].find({})

for document in cursor:
    print(document)

# for db in client.list_databases():
#     print(db)
